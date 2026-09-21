import * as sp from './spotify.js';

const app = document.getElementById('app');

const state = {
  boards: [],
  error: '',
  playing: null // { song, cat, board, status, revealed, startedAt }
};

let tickTimer = null;

/* ---------- lagring ---------- */

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTeams() {
  return loadJSON('mq.teams', []);
}

function setTeams(teams) {
  saveJSON('mq.teams', teams);
}

function usedKey(boardId) {
  return 'mq.used.' + boardId;
}

function getUsed(boardId) {
  return loadJSON(usedKey(boardId), []);
}

function isUsed(boardId, catIndex, difficulty) {
  return getUsed(boardId).indexOf(catIndex + ':' + difficulty) !== -1;
}

function markUsed(boardId, catIndex, difficulty, used) {
  const id = catIndex + ':' + difficulty;
  const list = getUsed(boardId).filter((x) => x !== id);
  if (used) list.push(id);
  saveJSON(usedKey(boardId), list);
}

/* ---------- hjelpere ---------- */

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function go(hash) {
  location.hash = hash;
}

/* ---------- ruting ---------- */

function route() {
  const parts = (location.hash.slice(1) || '/').split('/').filter(Boolean);
  if (parts[0] === 'b' && parts.length === 4) {
    return { view: 'play', boardId: parts[1], cat: Number(parts[2]), diff: Number(parts[3]) };
  }
  if (parts[0] === 'b' && parts.length === 2) {
    return { view: 'board', boardId: parts[1] };
  }
  return { view: 'home' };
}

function render() {
  const r = route();
  if (r.view === 'play') return renderPlay(r);
  stopTick();
  if (state.playing) {
    sp.stop().catch(() => {});
    state.playing = null;
  }
  if (r.view === 'board') return renderBoard(r);
  return renderHome();
}

/* ---------- felles deler ---------- */

// Merket: en ø som også er en plate. Fargene ligger i styles.css.
function mark(size) {
  return `<svg class="mark" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true" focusable="false">
      <circle class="ring" cx="50" cy="50" r="42" fill="none" stroke-width="6"></circle>
      <line class="slash" x1="16" y1="84" x2="84" y2="16" stroke-width="8" stroke-linecap="round"></line>
      <circle class="label" cx="50" cy="50" r="11" stroke-width="4"></circle>
    </svg>`;
}

function statusLine() {
  if (sp.getMode() === 'lenke') return { text: 'Åpner sangene i Spotify-appen', cls: 'ok' };
  if (!sp.getClientId()) return { text: 'Spotify er ikke satt opp', cls: 'warn' };
  if (!sp.isLoggedIn()) return { text: 'Ikke logget inn i Spotify', cls: 'warn' };
  const issue = sp.getAccountIssue();
  if (issue) return { text: issue, cls: 'bad' };
  const s = sp.getPlayerState();
  if (s === 'ready') return { text: 'Spotify er klar', cls: 'ok' };
  if (s === 'error') return { text: 'Spotify-feil: ' + sp.getPlayerError(), cls: 'bad' };
  return { text: 'Kobler til Spotify', cls: 'warn' };
}

// Advarsel om innebygd nettleser, for eksempel lenker åpnet i Messenger.
function browserWarning() {
  if (sp.getMode() === 'lenke') return '';
  const hint = sp.inAppBrowserHint();
  return hint ? `<p class="banner warn">${esc(hint)}</p>` : '';
}

function teamPanel() {
  const teams = getTeams();
  const rows = teams
    .map(
      (t, i) => `
      <li class="team">
        <span class="team-name">${esc(t.name)}</span>
        <span class="team-score">${t.score}</span>
        <span class="team-buttons">
          <button data-team-minus="${i}" aria-label="Trekk fra ett poeng">&minus;</button>
          <button data-team-plus="${i}" aria-label="Legg til ett poeng">+</button>
          <button data-team-remove="${i}" aria-label="Slett laget">&times;</button>
        </span>
      </li>`
    )
    .join('');

  return `
    <section class="panel">
      <h2>Lag</h2>
      <ul class="teams">${rows || '<li class="muted">Ingen lag enda.</li>'}</ul>
      <form class="row" id="add-team">
        <input name="name" placeholder="Navn på lag" autocomplete="off" maxlength="24">
        <button type="submit">Legg til</button>
      </form>
      ${teams.length ? '<button class="link" id="reset-scores">Nullstill poeng</button>' : ''}
    </section>`;
}

function wireTeamPanel(root) {
  const form = root.querySelector('#add-team');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      if (!name) return;
      setTeams(getTeams().concat({ name, score: 0 }));
      form.reset();
      render();
    });
  }
  root.querySelectorAll('[data-team-plus]').forEach((b) =>
    b.addEventListener('click', () => {
      const teams = getTeams();
      teams[Number(b.dataset.teamPlus)].score += 1;
      setTeams(teams);
      render();
    })
  );
  root.querySelectorAll('[data-team-minus]').forEach((b) =>
    b.addEventListener('click', () => {
      const teams = getTeams();
      teams[Number(b.dataset.teamMinus)].score -= 1;
      setTeams(teams);
      render();
    })
  );
  root.querySelectorAll('[data-team-remove]').forEach((b) =>
    b.addEventListener('click', () => {
      const teams = getTeams();
      if (!confirm('Slette ' + teams[Number(b.dataset.teamRemove)].name + '?')) return;
      teams.splice(Number(b.dataset.teamRemove), 1);
      setTeams(teams);
      render();
    })
  );
  const reset = root.querySelector('#reset-scores');
  if (reset) {
    reset.addEventListener('click', () => {
      setTeams(getTeams().map((t) => ({ ...t, score: 0 })));
      render();
    });
  }
}

/* ---------- forside ---------- */

function renderHome() {
  const s = statusLine();
  const boards = state.boards
    .map(
      (b) => `
      <a class="board-card" href="#/b/${b.id}">
        <h3>${esc(b.name)}</h3>
        <p>${esc(b.description || '')}</p>
        <span class="muted">${b.categories.length} kategorier &middot; ${b.categories.reduce((n, c) => n + c.songs.length, 0)} sanger</span>
      </a>`
    )
    .join('');

  const antallBrett = state.boards.length;
  const antallSanger = state.boards.reduce(
    (n, b) => n + b.categories.reduce((m, c) => m + c.songs.length, 0),
    0
  );
  const fakta = antallBrett
    ? `Ingen innlogging &middot; ${antallBrett} brett, ${antallSanger} sanger`
    : 'Ingen innlogging';

  const view = el(`
    <div class="page">
      <header class="brand">
        ${mark(26)}
        <span class="brand-name">Gehør</span>
        <span class="status ${s.cls}">${esc(s.text)}</span>
      </header>

      <section class="hero">
        <h1 class="hero-title">Ordet gjemmer seg i låta.</h1>
        <p class="hero-sub">En musikkquiz for rundt bordet. Åtte kategorier, fem sanger i hver. Svaret ligger i tittelen, artisten, teksten &mdash; eller i selve lyden.</p>
        <div class="hero-cta">
          <button class="btn primary" id="til-brett">Start en quiz</button>
          <button class="btn" id="til-eksempel">Se et eksempel</button>
        </div>
        <p class="facts">${fakta}</p>
      </section>

      ${browserWarning()}
      ${state.error ? `<p class="banner bad">${esc(state.error)}</p>` : ''}

      <section id="brett">
        <h2>Velg brett</h2>
        <div class="boards">${boards || '<p class="muted">Laster brett...</p>'}</div>
      </section>

      ${teamPanel()}

      <section>
        <h2>Slik spiller dere</h2>
        <ol class="steps">
          <li class="step">
            <span class="step-n">1</span>
            <div>
              <h3>Laget velger en rute</h3>
              <p>For eksempel Dyr 1. Tallet er vanskelighetsgraden, og det samme tallet er poengsummen.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-n">2</span>
            <div>
              <h3>Sangen spiller</h3>
              <p>Legg telefonen med skjermen ned.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-n">3</span>
            <div>
              <h3>Første lyd gjetter</h3>
              <p>Hvert lag har sin egen lyd. Første lag som lager sin, får fem sekunder. Feil svar gir fem sekunders sperre.</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="panel" id="eksempel">
        <h2>Et eksempel</h2>
        <div class="demo-tags">
          <span class="demo-tag">Dyr</span>
          <span class="cell d1" style="width: 32px; aspect-ratio: auto; height: 32px; font-size: 0.95rem;">1</span>
        </div>
        <p class="demo-song">Eye of the Tiger</p>
        <p class="demo-artist">Survivor</p>
        <div id="demo-svar">
          <button class="big" id="demo-vis">Vis fasit</button>
        </div>
      </section>

      <section class="panel">
        <h2>Spotify</h2>
        <div id="spotify-box"></div>
      </section>

      <footer class="foot">
        ${mark(18)}
        <span>Gratis &middot; Musikken kommer fra Spotify</span>
      </footer>
    </div>
  `);

  view.querySelector('#til-brett').addEventListener('click', () => {
    view.querySelector('#brett').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  view.querySelector('#til-eksempel').addEventListener('click', () => {
    view.querySelector('#eksempel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  const demoVis = view.querySelector('#demo-vis');
  demoVis.addEventListener('click', () => {
    view.querySelector('#demo-svar').replaceChildren(
      el(`
        <div class="answer" style="padding: 0; background: none; border: none;">
          <p class="answer-label">Fasit</p>
          <p class="answer-text">Tiger</p>
          <p class="answer-why">Står rett i tittelen.</p>
          <p class="answer-song">Ett poeng til laget som sa det først.</p>
        </div>
      `)
    );
  });

  wireTeamPanel(view);
  view.querySelector('#spotify-box').appendChild(spotifyBox());
  app.replaceChildren(view);
}

function spotifyBox() {
  if (!sp.getClientId()) {
    return el(`
      <div>
        <p class="banner bad">Appen mangler Spotify Client ID. Sett <code>DEFAULT_CLIENT_ID</code> i <code>spotify.js</code>.</p>
        <p class="muted small">Redirect URI for denne siden: <code>${esc(sp.redirectUri())}</code></p>
      </div>
    `);
  }

  const mode = sp.getMode();
  const box = el(`
    <div>
      <div class="modes">
        <button data-mode="lenke" class="mode-btn${mode === 'lenke' ? ' on' : ''}">I Spotify-appen</button>
        <button data-mode="sdk" class="mode-btn${mode === 'sdk' ? ' on' : ''}">Her i appen</button>
      </div>
      <p class="muted small">${
        mode === 'lenke'
          ? 'Trykk på en rute, så åpnes sangen i Spotify-appen. Ingen innlogging. Virker for alle, også uten Premium-konto hos oss.'
          : 'Spiller sangen rett i denne fanen, med pause og teller. Krever innlogging, Spotify Premium og plass på gjestelisten til appen.'
      }</p>
      ${
        mode === 'sdk'
          ? `<div class="row">
               ${sp.isLoggedIn() ? '<button id="logout">Logg ut</button>' : '<button id="login" class="primary">Logg inn i Spotify</button>'}
             </div>
             <p class="muted small">Redirect URI: <code>${esc(sp.redirectUri())}</code></p>`
          : ''
      }
      <div class="row">
        <button id="clear-cache" class="link">Tøm sang-cache</button>
      </div>
    </div>
  `);

  box.querySelectorAll('[data-mode]').forEach((b) =>
    b.addEventListener('click', () => {
      sp.setMode(b.dataset.mode);
      render();
    })
  );

  const login = box.querySelector('#login');
  if (login) {
    login.addEventListener('click', () => {
      sp.login().catch((err) => {
        state.error = err.message;
        render();
      });
    });
  }
  const logout = box.querySelector('#logout');
  if (logout) logout.addEventListener('click', () => sp.logout());
  box.querySelector('#clear-cache').addEventListener('click', () => {
    sp.clearTrackCache();
    alert('Sang-cachen er tømt.');
  });
  return box;
}

/* ---------- brett ---------- */

function renderBoard(r) {
  const board = state.boards.find((b) => b.id === r.boardId);
  if (!board) {
    app.replaceChildren(el('<div class="page"><p>Fant ikke brettet.</p><a class="link" href="#/">Til forsiden</a></div>'));
    return;
  }

  const grid = board.categories
    .map((cat, ci) => {
      const cells = cat.songs
        .slice()
        .sort((a, b) => a.difficulty - b.difficulty)
        .map((song) => {
          const used = isUsed(board.id, ci, song.difficulty);
          return `<a class="cell d${song.difficulty}${used ? ' used' : ''}" href="#/b/${board.id}/${ci}/${song.difficulty}">${song.difficulty}</a>`;
        })
        .join('');
      return `<div class="cat"><h3>${esc(cat.name)}</h3><div class="cells">${cells}</div></div>`;
    })
    .join('');

  const teams = getTeams();
  const scores = teams.length
    ? `<div class="scorebar">${teams
        .map((t) => `<span><b>${esc(t.name)}</b><i>${t.score}</i></span>`)
        .join('')}</div>`
    : '';

  const s = statusLine();
  const view = el(`
    <div class="page">
      <header class="brand">
        ${mark(22)}
        <span class="brand-name">Gehør</span>
        <a class="link" href="#/">Alle brett</a>
      </header>
      <header class="head">
        <h1>${esc(board.name)}</h1>
        <p class="status ${s.cls}">${esc(s.text)}</p>
      </header>
      ${browserWarning()}
      ${scores}
      <div class="grid">${grid}</div>
      <section class="panel">
        <button id="reset-board" class="link">Nullstill brukte ruter</button>
      </section>
      ${teamPanel()}
    </div>
  `);

  // Aktiver lyd mens vi fortsatt er inne i trykket. iOS Safari krever det.
  if (sp.getMode() === 'sdk') {
    view.querySelectorAll('.cell').forEach((a) => a.addEventListener('click', () => sp.activate()));
  }

  view.querySelector('#reset-board').addEventListener('click', () => {
    if (!confirm('Merke alle ruter som ubrukte?')) return;
    localStorage.removeItem(usedKey(board.id));
    render();
  });
  wireTeamPanel(view);
  app.replaceChildren(view);
}

/* ---------- avspilling ---------- */

function stopTick() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = null;
}

function renderPlay(r) {
  const board = state.boards.find((b) => b.id === r.boardId);
  const cat = board && board.categories[r.cat];
  const song = cat && cat.songs.find((s) => s.difficulty === r.diff);
  if (!song) {
    go('#/b/' + r.boardId);
    return;
  }

  const fresh = !state.playing || state.playing.song !== song;
  if (fresh) {
    const link = sp.getMode() === 'lenke';
    state.playing = {
      song,
      cat,
      board,
      status: link ? 'klar' : 'starter',
      revealed: false,
      startedAt: Date.now(),
      paused: false
    };
    markUsed(board.id, r.cat, song.difficulty, true);
    if (!link) startPlayback();
  }
  drawPlay();
}

function startTick(p) {
  stopTick();
  tickTimer = setInterval(() => {
    const t = document.getElementById('elapsed');
    if (t) t.textContent = formatTime(Date.now() - p.startedAt);
  }, 500);
}

function startPlayback() {
  const p = state.playing;
  sp.playSong(p.song)
    .then((label) => {
      p.played = label || '';
      p.status = 'spiller';
      p.startedAt = Date.now();
      drawPlay();
      startTick(p);
    })
    .catch((err) => {
      p.status = 'feil';
      p.error = err.message;
      drawPlay();
    });
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  return String(Math.floor(s / 60)) + ':' + String(s % 60).padStart(2, '0');
}

function drawPlay() {
  const p = state.playing;
  const teams = getTeams();
  const points = p.song.difficulty;

  const answerBlock = p.revealed
    ? `<div class="answer">
         <p class="answer-label">Fasit</p>
         <p class="answer-text">${esc(p.song.answer)}</p>
         <p class="answer-why">${esc(p.song.why || '')}</p>
         <p class="answer-song">${esc(p.song.title)}${p.song.artist ? ' &mdash; ' + esc(p.song.artist) : ''}</p>
         ${p.played ? `<p class="answer-song">Spotify spilte: ${esc(p.played)}</p>` : ''}
       </div>`
    : '<button id="reveal" class="big">Vis fasit</button>';

  const teamButtons = teams.length
    ? teams
        .map((t, i) => `<button class="score-btn" data-award="${i}">${esc(t.name)} +${points}</button>`)
        .join('')
    : '<p class="muted">Legg til lag på brettsiden for å gi poeng.</p>';

  const linkMode = sp.getMode() === 'lenke';
  const link = linkMode ? sp.openLink(p.song) : null;
  const started = p.status === 'spiller';

  const linkStage = link
    ? `<a class="btn big" id="open-spotify" href="${esc(link.url)}" target="_blank" rel="noopener">${
        link.exact ? 'Åpne i Spotify' : 'Søk i Spotify'
      }</a>
       <p class="playing-word" id="play-word"${started ? '' : ' hidden'}>SPILLER</p>
       <p class="elapsed" id="elapsed"${started ? '' : ' hidden'}>0:00</p>
       ${
         link.exact
           ? ''
           : '<p class="muted small">Denne sangen er ikke slått opp enda, så lenka åpner et søk i Spotify. Kjør <code>tools/resolve-uris.mjs</code> for å få ett trykk.</p>'
       }`
    : '';

  const status =
    p.status === 'feil'
      ? `<p class="banner bad">${esc(p.error || 'Ukjent feil')}</p>
         ${browserWarning()}
         <button id="retry">Prøv igjen</button>`
      : linkMode
        ? linkStage
        : `<p class="playing-word">${started ? (p.paused ? 'PAUSE' : 'SPILLER') : 'STARTER'}</p>
         <p class="elapsed" id="elapsed">0:00</p>`;

  const view = el(`
    <div class="page play">
      <header class="play-head">
        <a class="link" href="#/b/${p.board.id}">&larr; Tilbake</a>
        <span class="tag">${esc(p.cat.name)} ${p.song.difficulty}</span>
      </header>
      <div class="stage">${status}</div>
      ${
        linkMode
          ? ''
          : `<div class="controls">
        <button id="toggle">${p.paused ? 'Fortsett' : 'Pause'}</button>
        <button id="restart">Start på nytt</button>
      </div>`
      }
      ${answerBlock}
      <div class="award">${p.revealed ? teamButtons : ''}</div>
      <div class="play-foot">
        <button id="no-points" class="link">Ingen klarte den</button>
        <button id="unuse" class="link">Merk ruten som ubrukt</button>
      </div>
    </div>
  `);

  const reveal = view.querySelector('#reveal');
  if (reveal) {
    reveal.addEventListener('click', () => {
      p.revealed = true;
      drawPlay();
    });
  }
  // Lenka skal få lov til å navigere. Derfor ingen ny opptegning her, bare
  // teller og tekst som skrus på i DOM-en som allerede står der.
  const open = view.querySelector('#open-spotify');
  if (open) {
    open.addEventListener('click', () => {
      p.status = 'spiller';
      p.startedAt = Date.now();
      const word = view.querySelector('#play-word');
      const elapsed = view.querySelector('#elapsed');
      if (word) word.hidden = false;
      if (elapsed) {
        elapsed.hidden = false;
        elapsed.textContent = '0:00';
      }
      startTick(p);
    });
  }

  const toggle = view.querySelector('#toggle');
  if (toggle) toggle.addEventListener('click', () => {
    if (p.paused) {
      sp.resume();
      p.paused = false;
    } else {
      sp.pause();
      p.paused = true;
    }
    drawPlay();
  });
  const restart = view.querySelector('#restart');
  if (restart)
    restart.addEventListener('click', () => {
      sp.activate();
      p.paused = false;
      p.status = 'starter';
      drawPlay();
      startPlayback();
    });
  const retry = view.querySelector('#retry');
  if (retry) {
    retry.addEventListener('click', () => {
      sp.activate();
      p.status = 'starter';
      drawPlay();
      startPlayback();
    });
  }

  view.querySelectorAll('[data-award]').forEach((b) =>
    b.addEventListener('click', () => {
      const teams = getTeams();
      teams[Number(b.dataset.award)].score += points;
      setTeams(teams);
      sp.stop().catch(() => {});
      go('#/b/' + p.board.id);
    })
  );
  view.querySelector('#no-points').addEventListener('click', () => {
    sp.stop().catch(() => {});
    go('#/b/' + p.board.id);
  });
  view.querySelector('#unuse').addEventListener('click', () => {
    const ci = p.board.categories.indexOf(p.cat);
    markUsed(p.board.id, ci, p.song.difficulty, false);
    sp.stop().catch(() => {});
    go('#/b/' + p.board.id);
  });

  app.replaceChildren(view);
  const t = document.getElementById('elapsed');
  if (t && started) t.textContent = formatTime(Date.now() - p.startedAt);
}

/* ---------- oppstart ---------- */

async function loadBoards() {
  const ids = await fetch('./boards/index.json').then((r) => r.json());
  const boards = await Promise.all(
    ids.map((id) => fetch('./boards/' + id + '.json').then((r) => r.json()))
  );
  state.boards = boards.map((b, i) => ({ ...b, id: b.id || ids[i] }));
}

// Ferdig oppslåtte spor fra tools/resolve-uris.mjs. Fila kan mangle, det går fint.
async function loadTrackMap() {
  try {
    const res = await fetch('./boards/uris.json');
    if (res.ok) sp.setTrackMap(await res.json());
  } catch (e) {
    /* appen søker seg fram i stedet */
  }
}

async function main() {
  const err = await sp.handleRedirect();
  if (err) state.error = err;
  sp.onChange(() => {
    if (route().view !== 'play') render();
  });
  window.addEventListener('hashchange', render);
  render();
  try {
    await Promise.all([loadBoards(), loadTrackMap()]);
  } catch (e) {
    state.error = 'Klarte ikke å laste brettene. Kjør appen fra en webserver, ikke som fil.';
  }
  render();
  if (sp.getMode() === 'sdk' && sp.isLoggedIn()) sp.initPlayer().catch(() => {});
}

main();
