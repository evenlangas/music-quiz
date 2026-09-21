#!/usr/bin/env node
// Slår opp hver sang i brettene mot Spotify og lagrer treffet i boards/uris.json.
//
// Kjøres én gang av den som lager brettene, ikke av spillerne. Da trenger ikke
// appen å søke mens quizen går: ingen innlogging, ingen kvote, ingen gjesteliste.
//
//   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node tools/resolve-uris.mjs
//
// Client Secret lager du på https://developer.spotify.com/dashboard. Den hører
// hjemme her i terminalen, aldri i nettleseren.
//
// Flagg:
//   --board <id>     bare ett brett
//   --force          slå opp på nytt, også sanger som allerede står i uris.json
//   --dry-run        vis hva som ville blitt skrevet, uten å skrive
//   --market <kode>  landkode for søket, standard NO
//   --limit <n>      antall kandidater per søk, 1 til 10, standard 5

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BOARDS = join(ROOT, 'boards');
const MAP_FILE = join(BOARDS, 'uris.json');
const ACCOUNTS = process.env.SPOTIFY_ACCOUNTS_URL || 'https://accounts.spotify.com';
const API = process.env.SPOTIFY_API_URL || 'https://api.spotify.com/v1';

/* ---------- argumenter ---------- */

function parseArgs(argv) {
  const opts = { board: '', force: false, dryRun: false, market: 'NO', limit: 5 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force') opts.force = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--board') opts.board = argv[++i] || '';
    else if (a === '--market') opts.market = argv[++i] || 'NO';
    else if (a === '--limit') opts.limit = Number(argv[++i]);
    else {
      console.error('Ukjent flagg: ' + a);
      process.exit(2);
    }
  }
  // Spotify kuttet maks antall søketreff fra 50 til 10 i februar 2026.
  if (!Number.isFinite(opts.limit) || opts.limit < 1) opts.limit = 5;
  opts.limit = Math.min(opts.limit, 10);
  return opts;
}

/* ---------- sammenlikning av titler ---------- */

// Fjerner det som skiller "samme sang" fra hverandre i Spotify-katalogen.
function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s*[-–—]\s*(remaster|remastered|single|album|radio|mono|stereo|live|version|edit)\b.*$/i, '')
    .replace(/\((?:[^)]*\b(?:remaster|remastered|live|version|edit|mix|feat|featuring)\b[^)]*)\)/gi, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/&/g, ' og ')
    .replace(/[^a-z0-9æøå ]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Versjoner vi nesten aldri vil ha når vi leter etter originalen.
const JUNK = /\b(karaoke|tribute|made famous by|instrumental|cover version|originally performed|in the style of|8.?bit|lullaby|workout mix|sped up|slowed)\b/i;

function scoreCandidate(item, song) {
  const wantTitle = normalize(song.title);
  const wantArtist = normalize(song.artist);
  const gotTitle = normalize(item.name);
  const gotArtists = (item.artists || []).map((a) => normalize(a.name));

  let score = 0;
  if (gotTitle === wantTitle) score += 4;
  else if (gotTitle.startsWith(wantTitle) || wantTitle.startsWith(gotTitle)) score += 2;
  else if (gotTitle.includes(wantTitle) || wantTitle.includes(gotTitle)) score += 1;

  if (wantArtist) {
    if (gotArtists.some((a) => a === wantArtist)) score += 4;
    else if (gotArtists.some((a) => a.includes(wantArtist) || wantArtist.includes(a))) score += 2;
  } else {
    score += 1; // ingen artist oppgitt, tittelen må bære treffet alene
  }

  const haystack = item.name + ' ' + (item.album ? item.album.name : '') + ' ' + gotArtists.join(' ');
  if (JUNK.test(haystack)) score -= 6;
  if (item.explicit) score -= 0; // ingen mening for en quiz, men greit å se i rapporten
  score += Math.min(item.popularity || 0, 100) / 200; // skiller likeverdige treff

  return score;
}

/* ---------- spotify ---------- */

async function getToken(id, secret) {
  const res = await fetch(ACCOUNTS + '/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64')
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error('Fikk ikke token fra Spotify (' + res.status + '): ' + body.slice(0, 200));
  }
  return (await res.json()).access_token;
}

async function search(token, q, opts) {
  const url =
    API + '/search?type=track&limit=' + opts.limit + '&market=' + encodeURIComponent(opts.market) +
    '&q=' + encodeURIComponent(q);
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
    if (res.status === 429) {
      const wait = Number(res.headers.get('retry-after') || 2) + 1;
      console.error('  ventar ' + wait + 's (429 fra Spotify)');
      await sleep(wait * 1000);
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      throw new Error('Søk feilet (' + res.status + '): ' + body.slice(0, 200));
    }
    const data = await res.json();
    return (data.tracks && data.tracks.items) || [];
  }
  throw new Error('Spotify svarte 429 fem ganger på rad. Prøv igjen senere.');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- brett ---------- */

export function songKey(song) {
  return (song.artist || '').trim() + ' | ' + song.title;
}

async function readBoards(only) {
  const ids = JSON.parse(await readFile(join(BOARDS, 'index.json'), 'utf8'));
  const wanted = only ? ids.filter((id) => id === only) : ids;
  if (only && !wanted.length) throw new Error('Fant ikke brettet "' + only + '" i boards/index.json');
  const songs = [];
  for (const id of wanted) {
    const board = JSON.parse(await readFile(join(BOARDS, id + '.json'), 'utf8'));
    for (const cat of board.categories) {
      for (const song of cat.songs) songs.push({ board: id, cat: cat.name, song });
    }
  }
  return songs;
}

async function readMap() {
  try {
    return JSON.parse(await readFile(MAP_FILE, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') return {};
    throw e;
  }
}

function writeMapText(map) {
  const sorted = {};
  for (const key of Object.keys(map).sort((a, b) => a.localeCompare(b, 'no'))) sorted[key] = map[key];
  return JSON.stringify(sorted, null, 2) + '\n';
}

/* ---------- hovedløp ---------- */

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    console.error('Mangler SPOTIFY_CLIENT_ID og SPOTIFY_CLIENT_SECRET.');
    console.error('Lag dem på https://developer.spotify.com/dashboard og kjør:');
    console.error('  SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node tools/resolve-uris.mjs');
    process.exit(2);
  }

  const entries = await readBoards(opts.board);
  const map = await readMap();

  // Samme sang kan gå igjen på flere brett. Slå opp én gang.
  const todo = new Map();
  for (const e of entries) {
    if (e.song.uri) continue; // sangen er allerede låst til et spor i brettfila
    const key = songKey(e.song);
    if (!opts.force && map[key]) continue;
    if (!todo.has(key)) todo.set(key, e);
  }

  console.log(
    entries.length + ' sanger i brettene, ' + Object.keys(map).length + ' i uris.json fra før. ' +
      todo.size + ' å slå opp.'
  );
  if (!todo.size) return;

  const token = await getToken(id, secret);
  const uncertain = [];
  const missing = [];
  let done = 0;

  for (const [key, entry] of todo) {
    const song = entry.song;
    const artist = (song.artist || '').trim();
    const queries = artist
      ? ['track:' + song.title + ' artist:' + artist, song.title + ' ' + artist]
      : ['track:' + song.title, song.title];

    let best = null;
    let bestScore = -Infinity;
    for (const q of queries) {
      const items = await search(token, q, opts);
      for (const item of items) {
        const score = scoreCandidate(item, song);
        if (score > bestScore) {
          bestScore = score;
          best = item;
        }
      }
      if (bestScore >= 8) break; // tittel og artist stemmer, ikke behov for flere søk
      await sleep(120);
    }

    done++;
    const where = entry.board + '/' + entry.cat;
    if (!best) {
      missing.push({ key, where });
      console.log('  [' + done + '/' + todo.size + '] INGEN TREFF  ' + key + '  (' + where + ')');
      continue;
    }

    const label = best.name + ' — ' + best.artists.map((a) => a.name).join(', ');
    map[key] = { uri: best.uri, label };
    const flag = bestScore < 5 ? ' USIKKER' : '';
    if (bestScore < 5) uncertain.push({ key, label, where, score: bestScore.toFixed(1) });
    console.log('  [' + done + '/' + todo.size + ']' + flag + ' ' + key + '  ->  ' + label);
    await sleep(120);
  }

  if (opts.dryRun) {
    console.log('\n--dry-run: skriver ikke ' + MAP_FILE);
  } else {
    await writeFile(MAP_FILE, writeMapText(map), 'utf8');
    console.log('\nSkrev ' + Object.keys(map).length + ' sanger til boards/uris.json');
  }

  if (uncertain.length) {
    console.log('\nSjekk disse selv, treffet var svakt:');
    for (const u of uncertain) console.log('  ' + u.key + '  ->  ' + u.label + '  (' + u.where + ')');
  }
  if (missing.length) {
    console.log('\nFant ingenting for disse. Legg inn "uri" manuelt i brettfila:');
    for (const m of missing) console.log('  ' + m.key + '  (' + m.where + ')');
  }
}

main().catch((err) => {
  console.error('\nFeil: ' + err.message);
  process.exit(1);
});
