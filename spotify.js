// Spotify: innlogging med PKCE, søk etter låter og avspilling i nettleseren.

// Client ID er ikke hemmelig. Den er offentlig i PKCE-flyten.
// Alle som bruker appen logger inn med sin egen Spotify-konto.
const DEFAULT_CLIENT_ID = '693320aa63a34792a675f1a623193e8f';

const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1';
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state'
].join(' ');

const LS = {
  clientId: 'mq.clientId',
  token: 'mq.token',
  verifier: 'mq.verifier',
  returnTo: 'mq.returnTo',
  trackCache: 'mq.trackCache'
};

let player = null;
let deviceId = null;
let playerState = 'off'; // off | connecting | ready | error
let playerError = '';
const listeners = new Set();

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach((fn) => fn());
}

/* ---------- konfigurasjon ---------- */

// Alltid mappen med skråstrek på slutten, også om noen åpner index.html direkte.
export function redirectUri() {
  const dir = location.pathname.replace(/[^/]*$/, '');
  return location.origin + dir;
}

// En egen Client ID i localStorage overstyrer standarden. Nyttig for den som forker appen.
export function getClientId() {
  return localStorage.getItem(LS.clientId) || DEFAULT_CLIENT_ID;
}

/* ---------- token ---------- */

function readToken() {
  try {
    return JSON.parse(localStorage.getItem(LS.token) || 'null');
  } catch (e) {
    return null;
  }
}

function writeToken(data) {
  const old = readToken() || {};
  const t = {
    access_token: data.access_token,
    refresh_token: data.refresh_token || old.refresh_token,
    expires_at: Date.now() + (data.expires_in - 60) * 1000
  };
  localStorage.setItem(LS.token, JSON.stringify(t));
  return t;
}

export function isLoggedIn() {
  return !!readToken();
}

export function logout() {
  localStorage.removeItem(LS.token);
  if (player) {
    player.disconnect();
  }
  player = null;
  deviceId = null;
  playerState = 'off';
  emit();
}

async function refreshToken(token) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: token.refresh_token,
    client_id: getClientId()
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!res.ok) {
    logout();
    throw new Error('Innloggingen gikk ut. Logg inn på nytt.');
  }
  return writeToken(await res.json());
}

export async function getAccessToken() {
  let t = readToken();
  if (!t) throw new Error('Ikke logget inn i Spotify.');
  if (Date.now() > t.expires_at) t = await refreshToken(t);
  return t.access_token;
}

/* ---------- innlogging ---------- */

function randomString(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

function base64url(buf) {
  let s = '';
  new Uint8Array(buf).forEach((b) => {
    s += String.fromCharCode(b);
  });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function login() {
  const clientId = getClientId();
  if (!clientId) throw new Error('Mangler Spotify Client ID.');
  const verifier = randomString(96);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  sessionStorage.setItem(LS.verifier, verifier);
  sessionStorage.setItem(LS.returnTo, location.hash || '#/');
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri(),
    code_challenge_method: 'S256',
    code_challenge: base64url(digest),
    scope: SCOPES
  });
  location.href = AUTH_URL + '?' + params.toString();
}

// Kalles en gang når siden lastes. Gir tilbake en feiltekst, eller null.
export async function handleRedirect() {
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const error = params.get('error');
  if (!code && !error) return null;

  const back = sessionStorage.getItem(LS.returnTo) || '#/';
  history.replaceState({}, '', location.pathname + back);
  sessionStorage.removeItem(LS.returnTo);
  if (error) return 'Spotify avviste innloggingen: ' + error;

  const verifier = sessionStorage.getItem(LS.verifier);
  sessionStorage.removeItem(LS.verifier);
  if (!verifier) return 'Fant ikke innloggingsnøkkelen. Prøv igjen.';

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri(),
    client_id: getClientId(),
    code_verifier: verifier
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!res.ok) return 'Spotify ga ikke ut noe token. Sjekk Client ID og Redirect URI.';
  writeToken(await res.json());
  emit();
  return null;
}

/* ---------- web api ---------- */

async function api(path, options) {
  const opts = options || {};
  const token = await getAccessToken();
  const res = await fetch(API + path, {
    method: opts.method || 'GET',
    body: opts.body,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 204) return null;
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = (data && data.error && data.error.message) || String(res.status);
    throw new Error('Spotify: ' + msg);
  }
  return data;
}

/* ---------- avspiller ---------- */

export function getPlayerState() {
  return playerState;
}

export function getPlayerError() {
  return playerError;
}

export async function initPlayer() {
  if (player || !isLoggedIn()) return;
  playerState = 'connecting';
  emit();
  await window.sdkReady;

  player = new window.Spotify.Player({
    name: 'Musikkquiz',
    volume: 0.8,
    getOAuthToken: (cb) => {
      getAccessToken()
        .then(cb)
        .catch(() => {});
    }
  });

  player.addListener('ready', (data) => {
    deviceId = data.device_id;
    playerState = 'ready';
    playerError = '';
    emit();
  });
  player.addListener('not_ready', () => {
    playerState = 'connecting';
    emit();
  });
  ['initialization_error', 'authentication_error', 'account_error', 'playback_error'].forEach((ev) => {
    player.addListener(ev, (data) => {
      playerState = 'error';
      playerError = (data && data.message) || ev;
      emit();
    });
  });

  const ok = await player.connect();
  if (!ok) {
    playerState = 'error';
    playerError = 'Nettleseren klarte ikke å koble til Spotify.';
    emit();
  }
}

/* ---------- søk ---------- */

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(LS.trackCache) || '{}');
  } catch (e) {
    return {};
  }
}

function cacheSet(key, uri) {
  const c = readCache();
  c[key] = uri;
  localStorage.setItem(LS.trackCache, JSON.stringify(c));
}

export function clearTrackCache() {
  localStorage.removeItem(LS.trackCache);
}

export async function findTrackUri(song) {
  if (song.uri) return song.uri;
  const key = song.artist + ' | ' + song.title;
  const hit = readCache()[key];
  if (hit) return hit;

  const queries = [
    'track:' + song.title + ' artist:' + song.artist,
    song.title + ' ' + song.artist
  ];
  for (const q of queries) {
    const data = await api('/search?type=track&limit=1&market=from_token&q=' + encodeURIComponent(q));
    const item = data && data.tracks && data.tracks.items[0];
    if (item) {
      cacheSet(key, item.uri);
      return item.uri;
    }
  }
  throw new Error('Fant ikke sangen i Spotify.');
}

/* ---------- avspilling ---------- */

export async function playSong(song) {
  if (!getClientId()) throw new Error('Appen mangler Spotify Client ID.');
  if (!isLoggedIn()) throw new Error('Logg inn i Spotify på forsiden.');
  if (playerState !== 'ready') await initPlayer();
  for (let i = 0; i < 40 && !deviceId; i++) {
    await new Promise((r) => setTimeout(r, 250));
  }
  if (!deviceId) throw new Error('Avspilleren ble ikke klar. Last siden på nytt.');
  const uri = await findTrackUri(song);
  await api('/me/player/play?device_id=' + deviceId, {
    method: 'PUT',
    body: JSON.stringify({ uris: [uri], position_ms: song.startMs || 0 })
  });
}

export async function pause() {
  if (player) await player.pause();
}

export async function resume() {
  if (player) await player.resume();
}

export async function stop() {
  if (player) {
    await player.pause();
    await player.seek(0);
  }
}
