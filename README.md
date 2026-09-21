# Musikkquiz

Game master-app for brettspill-musikkquiz. Åtte kategorier per brett. Fem sanger per
kategori, med vanskelighetsgrad 1 til 5. Vanskelighetsgraden er også poengsummen.

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

Game master trykker "Logg inn i Spotify" på forsiden og logger inn med sin egen
Spotify-konto. Avspilling krever Spotify Premium.

Appen finner hver sang med et søk mot Spotify og husker treffet i nettleseren.
Vil du låse en sang til et bestemt opptak, legg til feltet `uri` på sangen.

### Hvem kan logge inn

Spotify-appen står i utviklingsmodus. Da kan bare personer på gjestelisten logge
inn, maks 25. Legg til nye game mastere slik:

1. Gå til https://developer.spotify.com/dashboard og åpne appen.
2. Trykk **Settings** og så **User Management**.
3. Skriv inn navn og e-postadressen personen bruker på Spotify.

### Vanlige feil

**«The user is not registered for this application» (403)**
Spotify-appen står i utviklingsmodus, og kontoen som logget inn står ikke på
gjestelisten. Legg personen til under **Settings → User Management**, som beskrevet
over. Vedkommende må logge ut og inn igjen etterpå.

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
| `uri` | nei | Låser sangen til ett bestemt Spotify-spor. |
| `startMs` | nei | Starter sangen et stykke uti. Standard er 0. |

Et brett bør ha åtte kategorier med fem sanger hver, en av hver vanskelighetsgrad.

## Brett som følger med

- **Klassisk oppvarming** – Dyr, Farger, Tall, Yrker, Byer, Kroppsdeler, Mat og drikke, Vær
- **Blandet drops** – Kjøretøy, Land, Klær, Fornavn, Verdensrommet, Dager og måneder, Sport, Familie
- **For viderekomne** – Drikke, Planter og blomster, Følelser, Tid på døgnet, Instrumenter, Hav og vann, Metaller og edelstener, Kjente personer

## Data i nettleseren

Appen lagrer dette i `localStorage`: Spotify Client ID, tilgangstoken, lagnavn og poeng,
hvilke ruter som er brukt, og hvilke Spotify-spor søkene fant. Ingenting sendes til
andre enn Spotify.
