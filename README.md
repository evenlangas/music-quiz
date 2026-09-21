# Gehør

Game master-app for brettspill-musikkquiz. Åtte kategorier per brett. Fem sanger per
kategori, med vanskelighetsgrad 1 til 5. Vanskelighetsgraden er også poengsummen.

Svaret gjemmer seg i låta: i tittelen, artisten, albumet, teksten eller selve lyden.

Appen er ren HTML, CSS og JavaScript. Den trenger ingen bygging.

## Slik spiller dere

1. Et lag velger en kategori og en vanskelighetsgrad, for eksempel "Dyr 1".
2. Game master trykker på tallet under kategorien.
3. Sangen starter. Legg telefonen med skjermen ned.
4. Første lag som lager lyden sin får 5 sekunder på å gjette.
5. Feil svar gir 5 sekunders sperre for det laget.
6. Game master trykker "Vis fasit" og gir poeng til riktig lag.

Svaret kan ligge i sangtittelen, artistnavnet, albumnavnet, teksten eller i selve lyden.

## Kjør appen lokalt

Appen må kjøre fra en webserver. Spotify-avspilleren krever `localhost` eller HTTPS.

```bash
python -m http.server 5173
```

Åpne `http://localhost:5173`.

## Koble til Spotify

Appen har to måter å spille på. Velg på forsiden, under **Spotify**.

### Åpne i Spotify-appen (standard)

Et trykk på en rute åpner sangen i Spotify-appen på telefonen. Ingen innlogging,
ingen gjesteliste, ingen Premium-krav fra oss: Spotify-appen spiller med den kontoen
brukeren allerede har. Dette er måten Hitster og liknende spill gjør det på, og den
virker også når lenken er åpnet inne i Messenger eller Instagram.

Game master ser låttittelen i Spotify mens sangen går. Det gjør ingenting, siden
game master uansett ser fasiten. Legg telefonen med skjermen ned, som ellers.

For at ett trykk skal treffe riktig spor må sangene være slått opp på forhånd, se
under. Er de ikke det, åpner lenken et søk i Spotify i stedet.

### Spill her i appen

Spiller sangen rett i nettleserfanen, med pause og teller. Da må game master
logge inn, ha **Spotify Premium**, og stå på gjestelisten til Spotify-appen.
Krever også en vanlig nettleser; innebygde nettlesere i Messenger og liknende
kan ikke spille av.

Appen finner hver sang med et søk mot Spotify og husker treffet i nettleseren.
Vil du låse en sang til et bestemt opptak, legg til feltet `uri` på sangen.

### Hvem kan logge inn

Dette gjelder bare "spill her i appen". Lenkemodus krever ingen innlogging.

Spotify-appen står i utviklingsmodus. Da kan bare personer på gjestelisten logge
inn. Legg til nye game mastere slik:

1. Gå til https://developer.spotify.com/dashboard og åpne appen.
2. Trykk **Settings** og så **User Management**.
3. Skriv inn navn og e-postadressen personen bruker på Spotify.

Spotify strammet inn utviklingsmodus i februar 2026: grensen er nå **fem brukere**
per app, ikke 25, og **den som eier appen må ha Premium** for at appen skal virke i
det hele tatt. Apper som allerede hadde flere brukere fikk beholde dem, men kan ikke
legge til nye. Er gjestelisten full, må nye game mastere lage sin egen Spotify-app og
legge inn sin egen Client ID, se under.

### Vanlige feil

**«The user is not registered for this application» (403)**
Spotify-appen står i utviklingsmodus, og kontoen som logget inn står ikke på
gjestelisten. Legg personen til under **Settings → User Management**, som beskrevet
over. Vedkommende må logge ut og inn igjen etterpå. Er de fem plassene brukt opp,
er egen Spotify-app eneste vei videre.

**«Cannot perform operation; no list was loaded»**
Kommer fra Spotify-avspilleren når appen ber om pause eller stopp før en sang er
lastet. Den er ufarlig, og appen viser den ikke lenger som en feil.

**Ingen lyd når lenken åpnes fra Messenger, Instagram eller Snapchat**
Innebygde nettlesere i andre apper kan ikke spille av Spotify. Åpne siden i Safari
eller Chrome. Appen viser en beskjed om dette når den kjenner igjen en slik nettleser.

**«Avspilling krever Spotify Premium»**
Web Playback SDK spiller bare av for Premium-kontoer.

### Forke appen med egen Spotify-app

Client ID ligger i `spotify.js` som `DEFAULT_CLIENT_ID`. Den er ikke hemmelig.
Vil du bruke din egen Spotify-app:

1. Gå til https://developer.spotify.com/dashboard og lag en app.
2. Kryss av for **Web API** og **Web Playback SDK**.
3. Legg inn Redirect URI for stedet appen kjører, med skråstrek på slutten.
   Lokalt er det `http://localhost:5173/`.
4. Kopier **Client ID** inn i `DEFAULT_CLIENT_ID`.

Appen bruker PKCE. Du trenger ikke Client Secret.

## Slå opp sangene på forhånd

`tools/resolve-uris.mjs` søker opp hver sang i brettene én gang og lagrer treffet i
`boards/uris.json`. Da slipper appen å søke mens quizen går: ingen innlogging, ingen
kvote, og lenkemodus åpner riktig spor med ett trykk.

Du trenger Client ID og Client Secret fra
https://developer.spotify.com/dashboard. Secret hører hjemme i terminalen, aldri i
nettleseren.

```bash
SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node tools/resolve-uris.mjs
```

| Flagg | Gjør |
| --- | --- |
| `--board <id>` | bare ett brett |
| `--force` | slå opp på nytt, også sanger som står i `uris.json` fra før |
| `--dry-run` | vis hva som ville blitt skrevet, uten å skrive |
| `--market <kode>` | landkode for søket, standard `NO` |
| `--limit <n>` | antall kandidater per søk, 1 til 10, standard 5 |

Skriptet velger bort karaoke- og tributeversjoner, og merker treff det er usikkert
på så du kan se over dem. Sanger det ikke fant, lister det til slutt: dem må du
legge inn med `uri` i brettfila selv. Kjører du det på nytt, hopper det over alt som
allerede er slått opp.

## Legg til et nytt brett

1. Lag en ny fil i `boards/`, for eksempel `boards/mitt-brett.json`.
2. Legg filnavnet uten `.json` inn i `boards/index.json`.

Formatet:

```json
{
  "id": "mitt-brett",
  "name": "Mitt brett",
  "description": "Kort beskrivelse.",
  "categories": [
    {
      "name": "Dyr",
      "songs": [
        {
          "difficulty": 1,
          "title": "Eye of the Tiger",
          "artist": "Survivor",
          "answer": "Tiger",
          "why": "Står rett i tittelen.",
          "uri": "spotify:track:<sporets-id>",
          "startMs": 0
        }
      ]
    }
  ]
}
```

| Felt | Må være med | Beskrivelse |
| --- | --- | --- |
| `difficulty` | ja | 1 til 5. Er også poengsummen. |
| `title` | ja | Sangtittel. Brukes til søk i Spotify. |
| `artist` | ja | Hovedartist. Brukes til søk i Spotify. |
| `answer` | ja | Fasit. Vises for game master. |
| `why` | nei | Forklaring på hvorfor svaret er riktig. |
| `uri` | nei | Låser sangen til ett bestemt Spotify-spor. Vinner over `boards/uris.json`. |
| `startMs` | nei | Starter sangen et stykke uti. Standard er 0. Virker bare i "spill her i appen"; en lenke til Spotify starter alltid på null. |

Et brett bør ha åtte kategorier med fem sanger hver, en av hver vanskelighetsgrad.

## Brett som følger med

- **Klassisk oppvarming** – Dyr, Farger, Tall, Yrker, Byer, Kroppsdeler, Mat og drikke, Vær
- **Blandet drops** – Kjøretøy, Land, Klær, Fornavn, Verdensrommet, Dager og måneder, Sport, Familie
- **For viderekomne** – Drikke, Planter og blomster, Følelser, Tid på døgnet, Instrumenter, Hav og vann, Metaller og edelstener, Kjente personer

## Utseende

Forsiden er også landingssiden: den forklarer spillet før den viser brettene.

Den visuelle profilen ligger i `styles.css` som CSS-variabler.

| Token | Verdi | Brukes til |
| --- | --- | --- |
| `--blekk` | `#0b0e13` | Bakgrunn |
| `--kull` | `#151a22` | Kort og paneler |
| `--kritt` | `#e9edf4` | Brødtekst |
| `--damp` | `#8a93a5` | Dempet tekst |
| `--signal` | `#f2a93b` | Merket, avspilling, fasit |
| `--ekko` | `#7c8cf8` | Lag og poeng |
| `--varsel` | `#e3574a` | Feil |
| `--grad-1` til `--grad-5` | grått til gult | Vanskelighetsgrad 1 til 5 |

Signalet er gult, ikke grønt. Spotifys utviklerpolicy forbyr apper å likne på
dem, og grønt er dessuten den mest opplagte fargen en musikkapp kan velge.

Merket er en ø tegnet som en plate: ring, spor og en skråstrek som også er
tonearm. Det ligger som inline SVG i `app.js` og som favicon i `index.html`.

Skriftene ligger i `fonts/` og hostes lokalt, se `fonts/LISENS.md`.

## Data i nettleseren

Appen lagrer dette i `localStorage`: Spotify Client ID, tilgangstoken, valgt
avspillingsmåte, lagnavn og poeng, hvilke ruter som er brukt, og hvilke Spotify-spor
søkene fant. Ingenting sendes til andre enn Spotify.
