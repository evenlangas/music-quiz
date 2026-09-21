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
let accountIssue = ''; // kontoen mangler tilgang eller Premium
let hasTrack = false; // har avspilleren fått en sang fra oss?
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

// Messenger, Instagram og liknende åpner lenker i en innebygd nettleser.
// Den har ikke det som skal til for å spille av Spotify, særlig på iPhone.
export function inAppBrowserHint() {
  const ua = navigator.userAgent || '';
  if (!/FBAN|FBAV|FB_IAB|Instagram|Snapchat|Line\/|MicroMessenger|TikTok|Twitter/i.test(ua)) return '';
  const ios = /iPhone|iPad|iPod/i.test(ua);
  return ios
    ? 'Du har åpnet appen inne i en annen app. Spotify kan ikke spille av her. Trykk på ••• øverst til høyre og velg «Åpne i Safari».'
    : 'Du har åpnet appen inne i en annen app. Spotify kan ikke spille av her. Åpne siden i en vanlig nettleser.';
}

// En egen Client ID i localStorage overstyrer standarden. Nyttig for den som forker appen.
export function getClientId() {
  return localStorage.getItem(LS.clientId) || DEFAULT_CLIENT_ID;
}

/* ---------- ferdig oppslåtte spor ---------- */

// boards/uris.json, laget av tools/resolve-uris.mjs. Da slipper appen å søke
// under quizen: ingen kvote brukt, og sporet er det samme hver gang.
let trackMap = {};

export function setTrackMap(map) {
  trackMap = map || {};
}

function trackKey(song) {
  return (song.artist || '').trim() + ' | ' + song.title;
}

// Spor vi allerede vet om: låst i brettfila, slått opp på forhånd, eller
// funnet av et tidligere søk i denne nettleseren.
function knownTrack(song) {
  if (song.uri) return { uri: song.uri, label: '' };
  const key = trackKey(song);
  return trackMap[key] || readCache()[key] || null;
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
  playerError = '';
  accountIssue = '';
  hasTrack = false;
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

/* ---------- feilmeldinger ---------- */

const NOT_REGISTERED =
  'Spotify-kontoen din er ikke lagt til i appen enda. Send e-postadressen du bruker på Spotify til den som eier appen, så blir du lagt inn under Settings og User Management på developer.spotify.com/dashboard.';
const NEEDS_PREMIUM =
  'Avspilling i nettleseren krever Spotify Premium. Kontoen du er logget inn med har ikke Premium.';

// Kontofeil gjelder hele økten, så vi husker dem og viser dem i statuslinjen.
export function getAccountIssue() {
  return accountIssue;
}

function setAccountIssue(msg) {
  if (accountIssue === msg) return;
  accountIssue = msg;
  emit();
}

// Gir en forklarende tekst for feil vi kjenner igjen, ellers tom streng.
function knownError(text) {
  const t = String(text || '');
  if (/not registered/i.test(t)) {
    setAccountIssue(NOT_REGISTERED);
    return NOT_REGISTERED;
  }
  if (/premium/i.test(t)) {
    setAccountIssue(NEEDS_PREMIUM);
    return NEEDS_PREMIUM;
  }
  return '';
}

function apiError(status, path, raw) {
  const known = knownError(raw);
  if (known) return known;
  const where = path.split('?')[0];
  if (status === 401) return 'Innloggingen i Spotify gikk ut. Logg inn på nytt på forsiden.';
  if (status === 429) return 'Spotify ber oss vente litt. Prøv igjen om noen sekunder.';
  if (status === 404 && where.indexOf('/me/player') === 0) {
    return 'Spotify mistet avspilleren. Last siden på nytt.';
  }
  if (status >= 500) return 'Spotify har trøbbel akkurat nå (' + status + '). Prøv igjen.';
  return 'Spotify svarte ' + status + ' på ' + where + ': ' + raw;
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
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Spotify svarer noen ganger med ren tekst eller HTML, særlig ved 5xx.
      const snippet = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
      throw new Error(apiError(res.status, path, snippet));
    }
  }
  if (!res.ok) {
    const msg = (data && data.error && data.error.message) || String(res.status);
    throw new Error(apiError(res.status, path, msg));
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

// Skriptet fra Spotify kan bli blokkert, for eksempel i en innebygd nettleser.
// Da venter vi ikke i det uendelige, og vi venter ikke en gang til neste gang heller.
let sdkFailed = false;
if (window.sdkReady) {
  window.sdkReady.then(() => {
    sdkFailed = false;
  });
}

const SDK_URL = 'https://sdk.scdn.co/spotify-player.js';
let sdkScript = null;
let sdkErrored = null;

// Legger inn skript-taggen første gang noen skal spille her i fanen.
function loadSdkScript() {
  if (sdkScript) return;
  sdkScript = document.createElement('script');
  sdkScript.src = SDK_URL;
  sdkScript.async = true;
  sdkErrored = new Promise((resolve, reject) => {
    sdkScript.onerror = () => reject(new Error('Spotify-avspilleren ble ikke lastet.'));
  });
  document.head.appendChild(sdkScript);
}

function waitForSdk() {
  const failed = new Error('Spotify-avspilleren ble ikke lastet.');
  if (sdkFailed) return Promise.reject(failed);
  loadSdkScript();
  return Promise.race([
    window.sdkReady,
    sdkErrored,
    new Promise((resolve, reject) => setTimeout(() => reject(failed), 15000))
  ]).catch((e) => {
    sdkFailed = true;
    throw e;
  });
}

export async function initPlayer() {
  if (player || !isLoggedIn()) return;
  playerState = 'connecting';
  playerError = '';
  emit();
  try {
    await waitForSdk();
  } catch (e) {
    playerState = 'error';
    playerError = inAppBrowserHint() || e.message + ' Last siden på nytt.';
    emit();
    return;
  }

  player = new window.Spotify.Player({
    name: 'Gehør',
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
    deviceId = null;
    hasTrack = false;
    playerState = 'connecting';
    emit();
  });
  ['initialization_error', 'authentication_error', 'account_error'].forEach((ev) => {
    player.addListener(ev, (data) => {
      const raw = (data && data.message) || ev;
      playerState = 'error';
      playerError = knownError(raw) || (ev === 'initialization_error' ? inAppBrowserHint() : '') || raw;
      emit();
    });
  });

  // playback_error er som regel forbigående. "no list was loaded" kommer bare av at
  // vi ba om pause eller stopp før noen sang var lastet, og skal ikke se ut som en feil.
  player.addListener('playback_error', (data) => {
    const raw = (data && data.message) || 'playback_error';
    if (/no list was loaded|no list is loaded/i.test(raw)) return;
    knownError(raw);
    console.warn('Spotify playback_error:', raw);
  });

  const ok = await player.connect();
  if (!ok) {
    playerState = 'error';
    playerError = inAppBrowserHint() || 'Nettleseren klarte ikke å koble til Spotify.';
    emit();
  }
}

// iOS Safari krever at lydelementet aktiveres inne i et trykk fra brukeren.
// Kall denne synkront fra en click-handler, før navigasjon eller await.
export function activate() {
  if (player && typeof player.activateElement === 'function') {
    player.activateElement().catch(() => {});
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

// Gir { uri, label }. label er navnet Spotify har på sporet, til kontroll.
export async function findTrack(song) {
  const known = knownTrack(song);
  if (known && known.uri) return known;
  const artist = (song.artist || '').trim();
  const key = trackKey(song);

  const queries = artist
    ? ['track:' + song.title + ' artist:' + artist, song.title + ' ' + artist]
    : ['track:' + song.title, song.title];
  for (const q of queries) {
    const data = await api('/search?type=track&limit=1&market=from_token&q=' + encodeURIComponent(q));
    const item = data && data.tracks && data.tracks.items[0];
    if (item) {
      const found = {
        uri: item.uri,
        label: item.name + ' — ' + item.artists.map((a) => a.name).join(', ')
      };
      cacheSet(key, found);
      return found;
    }
  }
  throw new Error('Fant ikke sangen i Spotify.');
}

/* ---------- avspilling ---------- */

export async function playSong(song) {
  if (!getClientId()) throw new Error('Appen mangler Spotify Client ID.');
  if (!isLoggedIn()) throw new Error('Logg inn i Spotify på forsiden.');
  if (accountIssue) throw new Error(accountIssue);
  if (playerState !== 'ready') await initPlayer();
  for (let i = 0; i < 40 && !deviceId; i++) {
    if (playerState === 'error') break;
    await new Promise((r) => setTimeout(r, 250));
  }
  if (!deviceId) {
    throw new Error(
      playerError || inAppBrowserHint() || 'Avspilleren ble ikke klar. Last siden på nytt.'
    );
  }
  const track = await findTrack(song);
  await api('/me/player/play?device_id=' + deviceId, {
    method: 'PUT',
    body: JSON.stringify({ uris: [track.uri], position_ms: song.startMs || 0 })
  });
  hasTrack = true;
  return track.label;
}

// Pause, fortsett og stopp gir "no list was loaded" hvis ingen sang er lastet.
// Vi hopper over kallet i stedet, og svelger feil som likevel skulle dukke opp.
export async function pause() {
  if (!player || !hasTrack) return;
  try {
    await player.pause();
  } catch (e) {
    /* ingenting spiller */
  }
}

export async function resume() {
  if (!player || !hasTrack) return;
  try {
    await player.resume();
  } catch (e) {
    /* ingenting spiller */
  }
}

export async function stop() {
  if (!player || !hasTrack) return;
  hasTrack = false;
  try {
    await player.pause();
    await player.seek(0);
  } catch (e) {
    /* ingenting spiller */
  }
}
