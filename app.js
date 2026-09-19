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

function statusLine() {
  if (!sp.getClientId()) return { text: 'Spotify er ikke satt opp', cls: 'warn' };
  if (!sp.isLoggedIn()) return { text: 'Ikke logget inn i Spotify', cls: 'warn' };
  const s = sp.getPlayerState();
  if (s === 'ready') return { text: 'Spotify er klar', cls: 'ok' };
  if (s === 'error') return { text: 'Spotify-feil: ' + sp.getPlayerError(), cls: 'bad' };
  return { text: 'Kobler til Spotify', cls: 'warn' };
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

  const view = el(`
    <div class="page">
      <header class="head">
        <h1>Musikkquiz</h1>
        <p class="status ${s.cls}">${esc(s.text)}</p>
      </header>
      ${state.error ? `<p class="banner bad">${esc(state.error)}</p>` : ''}
      <section>
        <h2>Velg brett</h2>
        <div class="boards">${boards || '<p class="muted">Laster brett...</p>'}</div>
      </section>
      ${teamPanel()}
      <section class="panel">
        <h2>Spotify</h2>
        <div id="spotify-box"></div>
      </section>
      <footer class="foot muted">Legg til nye brett i mappen <code>boards/</code>.</footer>
    </div>
  `);

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

  const box = el(`
    <div>
      <p class="muted">Logg inn med din egen Spotify-konto. Avspilling krever Spotify Premium.</p>
      <div class="row">
        ${sp.isLoggedIn() ? '<button id="logout">Logg ut</button>' : '<button id="login" class="primary">Logg inn i Spotify</button>'}
        <button id="clear-cache" class="link">Tøm sang-cache</button>
      </div>
      <p class="muted small">Redirect URI: <code>${esc(sp.redirectUri())}</code></p>
    </div>
  `);

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
          return `<a class="cell${used ? ' used' : ''}" href="#/b/${board.id}/${ci}/${song.difficulty}">${song.difficulty}</a>`;
        })
        .join('');
      return `<div class="cat"><h3>${esc(cat.name)}</h3><div class="cells">${cells}</div></div>`;
    })
    .join('');

  const teams = getTeams();
  const scores = teams.length
    ? `<div class="scorebar">${teams
        .map((t) => `<span><b>${esc(t.name)}</b> ${t.score}</span>`)
        .join('')}</div>`
    : '';

  const s = statusLine();
  const view = el(`
    <div class="page">
      <header class="head">
        <a class="link" href="#/">&larr; Brett</a>
        <h1>${esc(board.name)}</h1>
        <p class="status ${s.cls}">${esc(s.text)}</p>
      </header>
      ${scores}
      <div class="grid">${grid}</div>
      <section class="panel">
        <button id="reset-board" class="link">Nullstill brukte ruter</button>
      </section>
      ${teamPanel()}
    </div>
  `);

  // Aktiver lyd mens vi fortsatt er inne i trykket. iOS Safari krever det.
  view.querySelectorAll('.cell').forEach((a) => a.addEventListener('click', () => sp.activate()));

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
    state.playing = { song, cat, board, status: 'starter', revealed: false, startedAt: Date.now(), paused: false };
    markUsed(board.id, r.cat, song.difficulty, true);
    startPlayback();
  }
  drawPlay();
}

function startPlayback() {
  const p = state.playing;
  sp.playSong(p.song)
    .then((label) => {
      p.played = label || '';
      p.status = 'spiller';
      p.startedAt = Date.now();
      drawPlay();
      stopTick();
      tickTimer = setInterval(() => {
        const t = document.getElementById('elapsed');
        if (t) t.textContent = formatTime(Date.now() - p.startedAt);
      }, 500);
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

  const status =
    p.status === 'feil'
      ? `<p class="banner bad">${esc(p.error || 'Ukjent feil')}</p>
         <button id="retry">Prøv igjen</button>`
      : `<p class="playing-word">${p.status === 'spiller' ? (p.paused ? 'PAUSE' : 'SPILLER') : 'STARTER'}</p>
         <p class="elapsed" id="elapsed">0:00</p>`;

  const view = el(`
    <div class="page play">
      <header class="play-head">
        <a class="link" href="#/b/${p.board.id}">&larr; Tilbake</a>
        <span class="tag">${esc(p.cat.name)} ${p.song.difficulty}</span>
      </header>
      <div class="stage">${status}</div>
      <div class="controls">
        <button id="toggle">${p.paused ? 'Fortsett' : 'Pause'}</button>
        <button id="restart">Start på nytt</button>
      </div>
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
  view.querySelector('#toggle').addEventListener('click', () => {
    if (p.paused) {
      sp.resume();
      p.paused = false;
    } else {
      sp.pause();
      p.paused = true;
    }
    drawPlay();
  });
  view.querySelector('#restart').addEventListener('click', () => {
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
  if (t && p.status === 'spiller') t.textContent = formatTime(Date.now() - p.startedAt);
}

/* ---------- oppstart ---------- */

async function loadBoards() {
  const ids = await fetch('./boards/index.json').then((r) => r.json());
  const boards = await Promise.all(
    ids.map((id) => fetch('./boards/' + id + '.json').then((r) => r.json()))
  );
  state.boards = boards.map((b, i) => ({ ...b, id: b.id || ids[i] }));
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
    await loadBoards();
  } catch (e) {
    state.error = 'Klarte ikke å laste brettene. Kjør appen fra en webserver, ikke som fil.';
  }
  render();
  if (sp.isLoggedIn()) sp.initPlayer();
}

main();
