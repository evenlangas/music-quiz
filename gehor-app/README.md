# Gehør (app)

Musikkquiz med fysiske bokser og brett. Game master og lag bruker hver sin
telefon, og alt synkes med Supabase Realtime.

- **Boksen** har en hemmelig QR-kode inni. Den som skanner den kommer inn i boksens
  økt. Hver boks kan bare ha én åpen økt om gangen.
- Den første som skanner kan velge å bli **game master**. Etter det blir alle
  andre **lag**: de velger navn og én av seks farger.
- Game master skanner **brettet**. Brettet er "dumt": QR-koden er bare brett-id-en,
  og kategoriene står trykt på det. Sangene og fasiten ligger i databasen.
- Hvert lag har en **buzzer**. Et trykk sperrer laget selv i 8 sekunder og alle
  andre lag i 4. Serveren avgjør, så to lag som trykker samtidig kan ikke begge
  komme gjennom.
- Game master spiller sangen med Spotifys iFrame-embed, ser fasiten, og gir
  poengene (vanskelighetsgraden) til et lag.

## Oppbygging

| Del | Hva |
| --- | --- |
| `supabase/migrations/` | Tabeller, RLS og alle funksjonene klientene kaller (`peek_box`, `join_box`, `set_board`, `play_song`, `buzz`, `finish_song`, `end_session` …) |
| `supabase/seed.sql` | Testbokser og brettene fra Gehør v1. Lages av `npm run seed`. |
| `content/boards/` | Brettene som JSON, samme format som v1 |
| `src/` | React + TypeScript (Vite). Ett bygg for web, iOS og Android. |
| `tools/` | Seed, QR-koder og nye bokser |
| `qr/` | Ferdige QR-koder for testing. Åpne `qr/index.html` og skriv ut. |

Klientene skriver aldri direkte til tabellene. Alt går gjennom
`security definer`-funksjoner som sjekker hvem som spør. Hver telefon er en
**anonym Supabase-bruker**, så ingen trenger å lage konto. Lagene får aldri lese
`songs`-tabellen, så fasiten er bare hos game master.

## Kjør lokalt

```bash
npm install
cp .env.example .env.local   # fyll inn URL og anon key
npm run dev:lan              # tilgjengelig for telefoner på samme nett
```

Kameraet i nettleseren krever https (eller `localhost`). For å teste med telefon
lokalt, bruk en tunnel som `npx cloudflared tunnel --url http://localhost:5173`,
eller bare test mot den publiserte versjonen.

**Flere spillere på én maskin:** legg `?test` til adressen. Da får hver fane sin
egen anonyme bruker, så én fane kan være game master og en annen et lag. Uten
kamera kan du trykke «Skriv inn koden i stedet» og lime inn koden fra `qr/index.html`.

## Hosting for prototyping

Anbefalt: **Supabase (gratis) + GitHub Pages**. Ingen server å drifte.

### 1. Supabase

1. Lag et prosjekt på https://supabase.com (region: Stockholm `eu-north-1`).
2. **Authentication → Sign In / Providers → Allow anonymous sign-ins**: slå på.
3. Kjør databasen, enten
   - med CLI: `npx supabase login && npx supabase link --project-ref <ref> && npx supabase db push`,
     og så `supabase/seed.sql` i SQL Editor, eller
   - lim inn migrasjonen og så `seed.sql` i **SQL Editor** og kjør.
4. **Project Settings → API**: kopier Project URL og `anon`/publishable key.
   Begge er offentlige; sikkerheten ligger i RLS og funksjonene.

Gratisprosjekter pauses etter en uke uten trafikk. Trykk «Restore» i dashboardet.

### 2. Web (GitHub Pages)

1. Repoet: **Settings → Secrets and variables → Actions → Variables**, legg inn
   `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY`.
2. **Settings → Pages → Source: GitHub Actions**.
3. Push til `main`. `.github/workflows/pages.yml` bygger og publiserer til
   `https://<bruker>.github.io/<repo>/`.

Pages er alltid https, så kameraet virker. Netlify eller Vercel virker like bra
(byggkommando `npm run build`, mappe `dist`).

### 3. Native app (senere)

Samme kode pakkes med **Capacitor**:

```bash
npm run build
npx cap add ios        # krever Mac med Xcode
npx cap add android    # krever Android Studio
npx cap sync
npx cap open ios
```

Da bør skanneren byttes til `@capacitor-mlkit/barcode-scanning` (raskere, native
kamera) bak samme komponent, og buzzeren kan få `@capacitor/haptics`. Legg til
`NSCameraUsageDescription` i iOS-appens `Info.plist`. Distribusjon til testere:
TestFlight (iOS, krever Apple Developer-konto, 99 USD/år) og intern testing i
Google Play Console (engangsavgift 25 USD).

Se også «Spotify i native app» under.

## QR-koder

```bash
npm run qr                          # qr/*.png, qr/*.svg og qr/index.html
node tools/new-box.mjs "Boks 17"    # ny boks: kode, SQL og QR
```

| Kode | Innhold |
| --- | --- |
| Boks | `GEHOR:BOX:<hemmelig kode>` |
| Brett | `GEHOR:BOARD:<brett-id>` |

## Spotify

Game master spiller av med Spotifys
[iFrame API](https://developer.spotify.com/documentation/embeds/references/iframe-api).
Ingen innlogging i appen og ingen Client ID.

- Hele sanger spilles bare når game master er **logget inn på open.spotify.com i
  samme nettleser**. Ellers blir det 30 sekunders forhåndsvisning.
- iOS kan stoppe automatisk avspilling. Da må game master trykke play i embedden.
- Ingen av sangene fra v1 har Spotify-spor ennå. Game master får en søkelenke og
  kan lime inn lenken til sangen; den lagres i databasen for neste gang.
- **Spotify i native app:** inni en Capacitor-app er man ikke logget inn på Spotify,
  så embedden gir bare forhåndsvisninger. Alternativer: åpne sangen i Spotify-appen
  (`spotify:track:…`-lenke), eller Spotify App Remote SDK (native, krever plugin).

## Brett

Rediger JSON i `content/boards/`, kjør `npm run seed`, og kjør `supabase/seed.sql`
på nytt. Den oppdaterer brettene, men tar ikke vare på Spotify-spor som er lagt
inn fra appen. Legg dem inn i JSON-en (`uri`) først hvis de skal beholdes.
