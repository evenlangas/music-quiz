# Roller vi må fylle

Gehør er i dag ett produkt med to halvdeler: et fysisk brettspill og en
game master-app. Halvdelene har helt ulike behov. Brettet trenger design,
trykk, lager og butikkhyller. Appen trenger kode, drift og en avtale med
den som eier musikken. Bemanningsplanen under følger den delingen.

Realistisk tall: **tre personer på eiersiden og fire til fem innleide**.
Ikke åtte C-titler. Titlene under er hva rollen heter når den en gang blir
en stilling, ikke hvor mange hoder vi trenger i morgen.

---

## Det ene spørsmålet som avgjør resten

Appen spiller av hele spor gjennom Spotify Web Playback SDK, med en app som
står i utviklingsmodus og har plass til fem brukere. Det er en hobbyoppsett,
ikke et produkt.

Skal Gehør selges, må noen svare på dette før vi bruker en krone på trykk:

1. **Spotify**: kommersiell bruk krever egen avtale, og utviklervilkårene
   forbyr å bygge produkter som konkurrerer med eller bygger på tjenesten
   uten godkjenning. Extended quota mode er en søknad med forretningsvurdering,
   ikke et skjema.
2. **TONO og Gramo**: spilles musikk i en sosial sammenheng utenfor hjemmet,
   er det offentlig fremføring. Hvem klarerer, og hvem betaler?
3. **Plan B**: selge spillet med egne innspilte klipp, eller med spor som
   spilleren selv starter i sin egen strømmetjeneste. Begge endrer produktet.

Dette er ikke en juridisk detalj. Svaret bestemmer om selskapet finnes, hva
esken inneholder, og hvem vi må ansette. Derfor står det øverst, og derfor
er det daglig leder som eier det.

---

## Kjerneteam

### Daglig leder / CEO
Eier rettighetsspørsmålet over, forlagssamtalene og pengene. Forhandler med
Spotify, TONO, trykkeri og distributør. Søker Innovasjon Norge og SkatteFUNN.
Tar avgjørelsen mellom egen utgivelse, Kickstarter og et norsk spillforlag
(Cappelen Damm, Egmont Kids Media, Tactic, Vennerød).

Lykkes hvis: vi har skriftlig klarering på musikkbruken og en finansiert
førsteopplag-plan.

### Teknisk ansvarlig / CTO
Eier appen. Flytter Spotify-appen ut av utviklingsmodus eller bort fra
Spotify. Gjør game master-flyten robust nok for folk som ikke er oss:
innlogging som ikke krever gjesteliste, avspilling som overlever dårlig nett,
og et brettformat andre kan skrive innhold til.

I dag er dette Even. Rollen blir en stilling først når appen skal driftes
for tusen game mastere en lørdag kveld.

Lykkes hvis: en fremmed kan åpne appen, logge inn og kjøre en quiz uten hjelp.

### Quizredaktør / innholdssjef
Den undervurderte rollen, og den som faktisk er produktet. Tretten brett
finnes. Et salgbart spill trenger hundrevis av kvalitetssikrede spor med
riktig vanskelighetsgrad, kategorier som holder i flere runder, og fasiter
som ikke er til å diskutere.

Krever bred musikkunnskap på tvers av tiår og sjangre, redaksjonelt gangsyn,
og tålmodighet til å teste det samme brettet tjue ganger.

Lykkes hvis: vanskelighetsgrad 3 oppleves som 3 av folk som ikke lagde brettet.

---

## Spesialister før lansering

### Spilldesigner
Reglene er seks linjer i en README i dag. Et spill i eske trenger
rundestruktur, poengsystem som tåler ujevne lag, hva esken faktisk inneholder,
og en testrunde-logg som viser at det er gøy tredje gangen.
*Innleid, tre til seks måneder.*

### Grafisk designer / art director
Esken, brettet, kortene, regelheftet. Den visuelle profilen finnes allerede
som tokens i `styles.css` og øy-merket, men trykk er en annen disiplin enn
skjerm: CMYK, bleed, materialvalg.
*Innleid prosjekt.*

### Jurist med rettighetskompetanse
Musikklisensiering, Spotifys utviklervilkår, varemerkeregistrering av "Gehør",
forbrukerkjøp og personvern for appen.
*Innleid, men tidlig og på ordentlig.*

### Produksjons- og innkjøpsansvarlig
Trykkeri (Ludo Fact, Whatz Games, Delano, Panda), minsteopplag, enhetspris,
frakt, toll, lager. Avgjør om spillet kan selges til en pris folk betaler.
*Innleid konsulent, deretter del av daglig leders rolle.*

### Salgsansvarlig, retail
Norli, Ark, Extra Leker, Lekia, Platekompaniet, Coop Obs. Innkjøpsmøtene for
julesesongen holdes et halvt år før jul. Går vi via forlag, forsvinner denne
rollen inn i forlagets apparat, og det er et hovedargument for forlag.
*Deltid fra seks måneder før lansering.*

### Markedsansvarlig / CMO
For et norsk selskapsspill er dette sosiale medier, kreatorer og
julekampanje, ikke merkevarebygging. Kjøp det som tjeneste først, ansett
når det finnes et opplag å selge.
*Byrå eller frilans, deretter stilling.*

---

## Senere

| Rolle | Når |
| --- | --- |
| Økonomi / regnskap | Fra første faktura, som ekstern regnskapsfører. CFO tidligst ved flere produkter. |
| Kundeservice og community | Ved første opplag ut til kunder. |
| Lokaliseringsansvarlig | Ved Sverige og Danmark. Kategoriene og sporene er språkbundet, så dette er produktarbeid, ikke oversettelse. |
| QA- og testkoordinator | Når testrundene blir flere enn redaktøren rekker å sitte i selv. |

---

## Rekkefølge

| Fase | Hvem | Form |
| --- | --- | --- |
| Nå | Daglig leder, teknisk ansvarlig, quizredaktør | Gründere, aksjer |
| Nå | Jurist | Timer, få men tidlig |
| Når rettighetene er avklart | Spilldesigner, grafisk designer | Innleid prosjekt |
| Når spillet er designet | Produksjon og innkjøp | Konsulent |
| Seks måneder før lansering | Salg, marked | Deltid og byrå |
| Etter første opplag | Kundeservice, økonomi, lokalisering | Etter behov |

Ingenting under strek to bør ansettes før spørsmålet øverst er besvart.
