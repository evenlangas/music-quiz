-- Generert av tools/make-seed.mjs. Ikke rediger for hånd.

insert into public.boxes (code, label) values
  ('NS02IhMPr_spzA', 'Testboks 1'),
  ('-QdgKvp3jSdLzQ', 'Testboks 2')
on conflict (code) do nothing;

-- Klassisk oppvarming
insert into public.boards (id, name, description) values ('klassisk', 'Klassisk oppvarming', 'Kjente sanger og greie kategorier. Bra brett å starte med.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'klassisk';
with c as (insert into public.categories (board_id, position, name) values ('klassisk', 0, 'Dyr') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Eye of the Tiger', 'Survivor', 'Tiger', 'Står rett i tittelen.', null, 0),
    (2, 'Hungry Like the Wolf', 'Duran Duran', 'Ulv', 'Wolf betyr ulv. Står i tittelen.', null, 0),
    (3, 'Feel Good Inc.', 'Gorillaz', 'Gorilla', 'Bandet heter Gorillaz.', null, 0),
    (4, 'Hotel California', 'Eagles', 'Ørn', 'Bandet heter Eagles, som betyr ørner.', null, 0),
    (5, 'Nothing Else Matters', 'Metallica', 'Slange', 'Sangen er fra The Black Album. Omslaget viser en sammenrullet slange.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('klassisk', 1, 'Farger') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Yellow', 'Coldplay', 'Gul', 'Tittelen er fargen.', null, 0),
    (2, 'Purple Haze', 'Jimi Hendrix', 'Lilla', 'Purple betyr lilla.', null, 0),
    (3, 'Basket Case', 'Green Day', 'Grønn', 'Bandet heter Green Day.', null, 0),
    (4, 'While My Guitar Gently Weeps', 'The Beatles', 'Hvit', 'Sangen er fra The White Album.', null, 0),
    (5, 'Thinkin Bout You', 'Frank Ocean', 'Oransje', 'Albumet heter Channel Orange.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('klassisk', 2, 'Tall') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, '99 Luftballons', 'Nena', '99', 'Står i tittelen.', null, 0),
    (2, 'Summer of ''69', 'Bryan Adams', '69', 'Står i tittelen og i refrenget.', null, 0),
    (3, 'Hurt', 'Nine Inch Nails', '9', 'Bandet heter Nine Inch Nails.', null, 0),
    (4, 'Lose Yourself', 'Eminem', '8', 'Sangen er laget til filmen 8 Mile.', null, 0),
    (5, 'Rolling in the Deep', 'Adele', '21', 'Albumet heter 21.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('klassisk', 3, 'Yrker') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Rocket Man', 'Elton John', 'Astronaut', 'Sangen handler om en mann som blir sendt ut i rommet.', null, 0),
    (2, 'Piano Man', 'Billy Joel', 'Pianist', 'Står i tittelen.', null, 0),
    (3, 'Every Breath You Take', 'The Police', 'Politi', 'Bandet heter The Police.', null, 0),
    (4, 'Fortunate Son', 'Creedence Clearwater Revival', 'Soldat', 'Teksten handler om unge menn som blir sendt i krigen.', null, 0),
    (5, 'Sweet Home Alabama', 'Lynyrd Skynyrd', 'Lærer', 'Bandet er oppkalt etter gymlæreren sin, Leonard Skinner.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('klassisk', 4, 'Byer') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Empire State of Mind', 'JAY-Z', 'New York', 'Refrenget synger New York.', null, 0),
    (2, 'Viva Las Vegas', 'Elvis Presley', 'Las Vegas', 'Står i tittelen.', null, 0),
    (3, 'More Than a Feeling', 'Boston', 'Boston', 'Bandet heter Boston.', null, 0),
    (4, 'Under the Bridge', 'Red Hot Chili Peppers', 'Los Angeles', 'Teksten kaller byen the city of angels. Det er Los Angeles.', null, 0),
    (5, 'Wonderwall', 'Oasis', 'Manchester', 'Oasis kommer fra Manchester.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('klassisk', 5, 'Kroppsdeler') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Hips Don''t Lie', 'Shakira', 'Hofte', 'Hips betyr hofter.', null, 0),
    (2, 'Total Eclipse of the Heart', 'Bonnie Tyler', 'Hjerte', 'Heart står i tittelen.', null, 0),
    (3, 'Once in a Lifetime', 'Talking Heads', 'Hode', 'Bandet heter Talking Heads.', null, 0),
    (4, 'Jolene', 'Dolly Parton', 'Hår', 'Teksten beskriver flaming locks of auburn hair.', null, 0),
    (5, 'Start Me Up', 'The Rolling Stones', 'Tunge', 'Bandlogoen er en tunge og et par lepper.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('klassisk', 6, 'Mat og drikke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Sugar', 'Maroon 5', 'Sukker', 'Tittelen er svaret.', null, 0),
    (2, 'Red Red Wine', 'UB40', 'Vin', 'Wine står i tittelen.', null, 0),
    (3, 'Sunshine of Your Love', 'Cream', 'Fløte', 'Bandet heter Cream.', null, 0),
    (4, 'I''d Do Anything for Love (But I Won''t Do That)', 'Meat Loaf', 'Kjøttpudding', 'Artisten heter Meat Loaf. Det betyr kjøttpudding.', null, 0),
    (5, 'Sunday Morning', 'The Velvet Underground', 'Banan', 'Albumomslaget til Andy Warhol viser en banan.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('klassisk', 7, 'Vær') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Umbrella', 'Rihanna', 'Regn', 'Sangen handler om å stå under en paraply i regnet.', null, 0),
    (2, 'Thunderstruck', 'AC/DC', 'Torden og lyn', 'Thunder betyr torden.', null, 0),
    (3, 'Riders on the Storm', 'The Doors', 'Storm', 'Sangen åpner med lyden av regn og torden.', null, 0),
    (4, 'Cold as Ice', 'Foreigner', 'Is og kulde', 'Ice står i tittelen.', null, 0),
    (5, 'There There', 'Radiohead', 'Hagl', 'Albumet heter Hail to the Thief. Hail betyr hagl.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Blandet drops
insert into public.boards (id, name, description) values ('blandet', 'Blandet drops', 'Nye kategorier og flere hint som ligger i artistnavn og album.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'blandet';
with c as (insert into public.categories (board_id, position, name) values ('blandet', 0, 'Kjøretøy') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Yellow Submarine', 'The Beatles', 'Ubåt', 'Submarine betyr ubåt.', null, 0),
    (2, 'Mustang Sally', 'Wilson Pickett', 'Bil', 'Mustang er en Ford-modell. Teksten handler om bilen hennes.', null, 0),
    (3, 'Crazy Train', 'Ozzy Osbourne', 'Tog', 'Train betyr tog.', null, 0),
    (4, 'Born to Be Wild', 'Steppenwolf', 'Motorsykkel', 'Teksten roper get your motor runnin''. Sangen er kjent fra filmen Easy Rider.', null, 0),
    (5, 'Somebody to Love', 'Jefferson Airplane', 'Fly', 'Bandet heter Jefferson Airplane.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('blandet', 1, 'Land') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Living in America', 'James Brown', 'USA', 'America står i tittelen.', null, 0),
    (2, 'Gangnam Style', 'PSY', 'Sør-Korea', 'Gangnam er en bydel i Seoul.', null, 0),
    (3, 'One Night in Bangkok', 'Murray Head', 'Thailand', 'Bangkok er hovedstaden i Thailand.', null, 0),
    (4, 'Vienna', 'Billy Joel', 'Østerrike', 'Vienna er Wien, hovedstaden i Østerrike.', null, 0),
    (5, 'Bohemian Rhapsody', 'Queen', 'Tsjekkia', 'Bohemia er Böhmen, en historisk landsdel i Tsjekkia.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('blandet', 2, 'Klær') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Blue Suede Shoes', 'Elvis Presley', 'Sko', 'Shoes står i tittelen.', null, 0),
    (2, 'Raspberry Beret', 'Prince', 'Lue eller alpelue', 'En beret er en alpelue.', null, 0),
    (3, 'Sharp Dressed Man', 'ZZ Top', 'Dress', 'Teksten ramser opp slips, jakke og sko.', null, 0),
    (4, 'Billie Jean', 'Michael Jackson', 'Hanske', 'Michael Jackson danset alltid til denne med den hvite hansken.', null, 0),
    (5, 'Get Lucky', 'Daft Punk', 'Hjelm', 'Daft Punk opptrer alltid med robothjelmer.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('blandet', 3, 'Fornavn') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Hey Jude', 'The Beatles', 'Jude', 'Navnet synges i refrenget.', null, 0),
    (2, 'Layla', 'Derek and the Dominos', 'Layla', 'Navnet står i tittelen.', null, 0),
    (3, 'Come On Eileen', 'Dexys Midnight Runners', 'Eileen', 'Navnet ropes i refrenget.', null, 0),
    (4, 'Candle in the Wind', 'Elton John', 'Norma Jean', 'Første linje er Goodbye Norma Jean. Det er Marilyn Monroe sitt ekte navn.', null, 0),
    (5, 'American Pie', 'Don McLean', 'Buddy', 'Sangen handler om flystyrten der Buddy Holly døde.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('blandet', 4, 'Verdensrommet') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Fly Me to the Moon', 'Frank Sinatra', 'Månen', 'Moon står i tittelen.', null, 0),
    (2, 'Walking on Sunshine', 'Katrina and the Waves', 'Sola', 'Sunshine betyr solskinn.', null, 0),
    (3, 'Black Hole Sun', 'Soundgarden', 'Svart hull', 'Black hole står i tittelen.', null, 0),
    (4, 'Money', 'Pink Floyd', 'Månen', 'Albumet heter The Dark Side of the Moon.', null, 0),
    (5, 'Uptown Funk', 'Mark Ronson', 'Mars', 'Vokalisten heter Bruno Mars.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('blandet', 5, 'Dager og måneder') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Friday I''m in Love', 'The Cure', 'Fredag', 'Friday står i tittelen.', null, 0),
    (2, 'Manic Monday', 'The Bangles', 'Mandag', 'Monday står i tittelen.', null, 0),
    (3, 'September', 'Earth, Wind & Fire', 'September', 'Teksten synger om den 21. september.', null, 0),
    (4, 'November Rain', 'Guns N'' Roses', 'November', 'November står i tittelen.', null, 0),
    (5, 'Mr. Jones', 'Counting Crows', 'August', 'Albumet heter August and Everything After.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('blandet', 6, 'Sport') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Sk8er Boi', 'Avril Lavigne', 'Skateboard', 'Sk8er betyr skater.', null, 0),
    (2, 'Surfin'' U.S.A.', 'The Beach Boys', 'Surfing', 'Surfin'' står i tittelen.', null, 0),
    (3, 'Gonna Fly Now', 'Bill Conti', 'Boksing', 'Dette er temaet fra Rocky.', null, 0),
    (4, 'Chariots of Fire', 'Vangelis', 'Løping', 'Musikken er fra filmen om britiske OL-løpere.', null, 0),
    (5, 'Seven Nation Army', 'The White Stripes', 'Fotball', 'Riffet synges på fotballstadion over hele verden.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('blandet', 7, 'Familie') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Papa Don''t Preach', 'Madonna', 'Far', 'Papa står i tittelen.', null, 0),
    (2, 'Mamma Mia', 'ABBA', 'Mor', 'Mamma står i tittelen.', null, 0),
    (3, 'He Ain''t Heavy, He''s My Brother', 'The Hollies', 'Bror', 'Brother står i tittelen.', null, 0),
    (4, 'We Are Family', 'Sister Sledge', 'Søster', 'Gruppen heter Sister Sledge og består av fire søstre.', null, 0),
    (5, 'Use Somebody', 'Kings of Leon', 'Bestefar', 'Bandet er oppkalt etter bestefaren til brødrene, som het Leon.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- For viderekomne
insert into public.boards (id, name, description) values ('viderekomne', 'For viderekomne', 'Her ligger svaret oftere i artistnavn, album eller et enkelt lydspor.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'viderekomne';
with c as (insert into public.categories (board_id, position, name) values ('viderekomne', 0, 'Drikke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Tequila', 'The Champs', 'Tequila', 'Ordet ropes tre ganger i sangen.', null, 0),
    (2, 'Milkshake', 'Kelis', 'Milkshake', 'Står i tittelen og i refrenget.', null, 0),
    (3, 'Champagne Supernova', 'Oasis', 'Champagne', 'Står i tittelen.', null, 0),
    (4, 'Formation', 'Beyoncé', 'Limonade', 'Albumet heter Lemonade.', null, 0),
    (5, 'Lola', 'The Kinks', 'Cola', 'Teksten synger it tasted just like cherry cola. BBC nektet dem å synge Coca-Cola.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('viderekomne', 1, 'Planter og blomster') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Sunflower', 'Post Malone', 'Solsikke', 'Sunflower betyr solsikke.', null, 0),
    (2, 'Bed of Roses', 'Bon Jovi', 'Rose', 'Roses står i tittelen.', null, 0),
    (3, 'Strawberry Fields Forever', 'The Beatles', 'Jordbær', 'Strawberry betyr jordbær.', null, 0),
    (4, 'Smile', 'Lily Allen', 'Lilje', 'Artisten heter Lily. Det betyr lilje.', null, 0),
    (5, 'Glycerine', 'Bush', 'Busk', 'Bandet heter Bush. Det betyr busk.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('viderekomne', 2, 'Følelser') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Happy', 'Pharrell Williams', 'Glede', 'Happy betyr glad.', null, 0),
    (2, 'Tears in Heaven', 'Eric Clapton', 'Sorg', 'Tears betyr tårer. Clapton skrev den etter at sønnen døde.', null, 0),
    (3, 'Fear of the Dark', 'Iron Maiden', 'Frykt', 'Fear betyr frykt.', null, 0),
    (4, 'Jealous Guy', 'John Lennon', 'Sjalusi', 'Jealous betyr sjalu.', null, 0),
    (5, 'Blue Monday', 'New Order', 'Tristhet', 'Blue betyr trist på engelsk.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('viderekomne', 3, 'Tid på døgnet') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Midnight City', 'M83', 'Midnatt', 'Midnight står i tittelen.', null, 0),
    (2, 'Morning Has Broken', 'Cat Stevens', 'Morgen', 'Morning står i tittelen.', null, 0),
    (3, 'In the Air Tonight', 'Phil Collins', 'Kveld', 'Tonight betyr i kveld.', null, 0),
    (4, 'Waterloo Sunset', 'The Kinks', 'Solnedgang', 'Sunset betyr solnedgang.', null, 0),
    (5, 'Nocturne', 'Secret Garden', 'Natt', 'En nocturne er et musikkstykke om natten. Sangen vant Eurovision for Norge i 1995.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('viderekomne', 4, 'Instrumenter') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Mr. Tambourine Man', 'Bob Dylan', 'Tamburin', 'Står i tittelen.', null, 0),
    (2, 'Careless Whisper', 'George Michael', 'Saksofon', 'Sangen åpner med et av de mest kjente saksofonriffene.', null, 0),
    (3, 'Sultans of Swing', 'Dire Straits', 'Gitar', 'Sangen handler om et band og er full av gitarsoloer.', null, 0),
    (4, 'The Final Countdown', 'Europe', 'Synthesizer', 'Hele introen er et synthriff.', null, 0),
    (5, 'Don''t Fear the Reaper', 'Blue Öyster Cult', 'Kubjelle', 'Sangen er kjent for cowbellen, og for sketsjen more cowbell.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('viderekomne', 5, 'Hav og vann') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Sailing', 'Rod Stewart', 'Seilbåt', 'Sailing betyr å seile.', null, 0),
    (2, 'Smoke on the Water', 'Deep Purple', 'Vann', 'Water står i tittelen.', null, 0),
    (3, 'Wipe Out', 'The Surfaris', 'Bølge', 'Dette er en surfelåt. Wipe out er å velte i en bølge.', null, 0),
    (4, 'The River', 'Bruce Springsteen', 'Elv', 'River betyr elv.', null, 0),
    (5, 'Kiss from a Rose', 'Seal', 'Sel', 'Artisten heter Seal. Det betyr sel.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('viderekomne', 6, 'Metaller og edelstener') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Gold', 'Spandau Ballet', 'Gull', 'Gold ropes i refrenget.', null, 0),
    (2, 'Diamonds', 'Rihanna', 'Diamant', 'Står i tittelen.', null, 0),
    (3, 'Iron Man', 'Black Sabbath', 'Jern', 'Iron betyr jern.', null, 0),
    (4, 'Alive', 'Pearl Jam', 'Perle', 'Bandet heter Pearl Jam. Pearl betyr perle.', null, 0),
    (5, 'Stairway to Heaven', 'Led Zeppelin', 'Bly', 'Led i Led Zeppelin betyr bly.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('viderekomne', 7, 'Kjente personer') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Rasputin', 'Boney M.', 'Rasputin', 'Navnet ropes i refrenget.', null, 0),
    (2, 'Vincent', 'Don McLean', 'Vincent van Gogh', 'Sangen starter med Starry, starry night og handler om maleren.', null, 0),
    (3, 'Bette Davis Eyes', 'Kim Carnes', 'Bette Davis', 'Navnet står i tittelen. Hun var en amerikansk filmstjerne.', null, 0),
    (4, 'Pride (In the Name of Love)', 'U2', 'Martin Luther King jr.', 'Teksten synger om skuddene i Memphis den 4. april.', null, 0),
    (5, 'Man on the Moon', 'R.E.M.', 'Andy Kaufman', 'Hele sangen handler om den amerikanske komikeren.', null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Julequiz desember 2019
insert into public.boards (id, name, description) values ('julequiz-2019', 'Julequiz desember 2019', 'Seks kategorier. Stat i USA, film, yrke, by, farge og fremkomstmiddel.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'julequiz-2019';
with c as (insert into public.categories (board_id, position, name) values ('julequiz-2019', 0, 'Stat i USA') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Sweet Home Alabama', 'Lynyrd Skynyrd', 'Alabama', null, null, 0),
    (2, 'Theme from New York, New York', 'Frank Sinatra', 'New York', null, null, 0),
    (3, 'Viva Las Vegas', 'Elvis Presley', 'Nevada (Las Vegas)', null, null, 0),
    (4, 'California Girls', '', 'California', null, null, 0),
    (5, 'Oceans Away', 'A R I Z O N A', 'Arizona', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('julequiz-2019', 1, 'Film') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'He''s a Pirate', 'Klaus Badelt', 'Pirates of the Caribbean', null, null, 0),
    (2, '(I''ve Had) The Time of My Life', 'Bill Medley', 'Dirty Dancing', null, null, 0),
    (3, 'Sex and the City Theme', '', 'Sex and the City', null, null, 0),
    (4, 'I Like to Move It', 'Reel 2 Real', 'Madagascar', null, null, 0),
    (5, 'Overture (Mary Poppins)', '', 'Mary Poppins', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('julequiz-2019', 2, 'Yrke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Please Mr. Postman', '', 'Postmann', null, null, 0),
    (2, 'I Shot the Sheriff', '', 'Sheriff', null, null, 0),
    (3, 'Cosy in the Rocket', 'Psapp', 'Lege/kirurg (Grey''s Anatomy)', null, null, 0),
    (4, 'Clown', 'Emeli Sandé', 'Klovn', null, null, 0),
    (5, 'Roxanne', 'The Police', 'Politi', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('julequiz-2019', 3, 'By') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Walking in Memphis', 'Marc Cohn', 'Memphis', null, null, 0),
    (2, 'Beautiful Girls', 'Sean Kingston', 'Kingston', null, null, 0),
    (3, 'Høyt over Oslo', '', 'Oslo', null, null, 0),
    (4, 'Les Champs-Élysées', 'Joe Dassin', 'Paris', null, null, 0),
    (5, 'London Bridge', 'Fergie', 'London', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('julequiz-2019', 4, 'Farge') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Just Give Me a Reason', 'P!nk', 'Rosa', null, null, 0),
    (2, 'Black Velvet', 'Alannah Myles', 'Svart', null, null, 0),
    (3, 'White Christmas', 'Bing Crosby', 'Hvit', null, null, 0),
    (4, 'Under the Bridge', 'Red Hot Chili Peppers', 'Rød', null, null, 0),
    (5, 'Thinkin Bout You', 'Frank Ocean', 'Oransje', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('julequiz-2019', 5, 'Fremkomstmiddel') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Chasing Cars', 'Snow Patrol', 'Bil', null, null, 0),
    (2, 'Hey, Soul Sister', 'Train', 'Tog', null, null, 0),
    (3, 'Leaving on a Jet Plane', 'John Denver', 'Fly', null, null, 0),
    (4, 'Buy Me a Boat', 'Chris Janson', 'Båt', null, null, 0),
    (5, 'Black Beauty', 'Lana Del Rey', 'Hest', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Musikkquiz mars 2020
insert into public.boards (id, name, description) values ('mars-2020', 'Musikkquiz mars 2020', 'Sted, film, farge, fremkomstmiddel, stat i USA, yrke, bilmerke og alkohol.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'mars-2020';
with c as (insert into public.categories (board_id, position, name) values ('mars-2020', 0, 'Sted') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Haugenstua', '', 'Haugenstua', null, null, 0),
    (2, 'Hollywood''s Bleeding', 'Post Malone', 'Hollywood', null, null, 0),
    (3, 'Saint-Tropez', 'Post Malone', 'Saint-Tropez', null, null, 0),
    (4, 'Merdøs pris', '', 'Merdø', null, null, 0),
    (5, 'Hey, Soul Sister', 'Train', 'San Francisco', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2020', 1, 'Film/serie') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Prologue', 'John Williams', 'Harry Potter', null, null, 0),
    (2, 'Lose Yourself', 'Eminem', '8 Mile', null, null, 0),
    (3, 'I Don''t Want to Be', 'Gavin DeGraw', 'One Tree Hill', null, null, 0),
    (4, 'I Will Always Love You', 'Whitney Houston', 'The Bodyguard', null, null, 0),
    (5, 'Graduation', '', 'Bie-filmen', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2020', 2, 'Farge') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Blue (Da Ba Dee)', 'Eiffel 65', 'Blå', null, null, 0),
    (2, 'Red', 'Taylor Swift', 'Rød', null, null, 0),
    (3, 'Purple Rain', 'Prince', 'Lilla', null, null, 0),
    (4, 'Forrest Gump', 'Frank Ocean', 'Oransje', null, null, 0),
    (5, 'Blue Lagoon', '', 'Blå', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2020', 3, 'Fremkomstmiddel') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Volvo og Viagra', '', 'Bil (Volvo)', null, null, 0),
    (2, 'My Truck', 'BRELAND', 'Pickup', null, null, 0),
    (3, 'Fast Car', 'Tracy Chapman', 'Bil', null, null, 0),
    (4, 'Pale Horses', 'Moby', 'Hest', null, null, 0),
    (5, 'Downtown', '', 'Esel', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2020', 4, 'Stat i USA') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Empire State of Mind', 'JAY-Z', 'New York', null, null, 0),
    (2, 'California King Bed', 'Rihanna', 'California', null, null, 0),
    (3, 'If Only as a Ghost', '', 'Alaska', null, null, 0),
    (4, 'Texas', '', 'Texas', null, null, 0),
    (5, 'Drive By', 'Train', 'California', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2020', 5, 'Yrke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Postmann Pat', '', 'Postmann', null, null, 0),
    (2, 'Brandy (You''re a Fine Girl)', 'Looking Glass', 'Seiler', null, null, 0),
    (3, 'Shake That', 'Eminem', 'Stripper', null, null, 0),
    (4, 'Every Breath You Take', 'The Police', 'Politi', null, null, 0),
    (5, 'Truth Hurts', 'Lizzo', 'Frisør', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2020', 6, 'Bilmerke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Granada', '', 'Granada', null, null, 0),
    (2, 'Porsche Cayenne', '', 'Porsche Cayenne', null, null, 0),
    (3, 'Brand New Cadillac', 'The Clash', 'Cadillac', null, null, 0),
    (4, 'Little Red Corvette', 'Prince', 'Corvette', null, null, 0),
    (5, 'Democracy', 'Leonard Cohen', 'Chevrolet', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2020', 7, 'Alkohol') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Whiskey Lullaby', 'Brad Paisley', 'Whiskey', null, null, 0),
    (2, 'Ølbriller', '', 'Øl', null, null, 0),
    (3, 'Shots', 'LMFAO', 'Shots', null, null, 0),
    (4, 'Hvite menn som pusher 50', 'Karpe', 'Pils', null, null, 0),
    (5, 'Rehab', 'Amy Winehouse', 'Vin', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Musikkquiz juli 2022
insert into public.boards (id, name, description) values ('juli-2022', 'Musikkquiz juli 2022', 'Yrke, fremkomstmiddel, film, farge, alkohol, mat, steder og tall.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'juli-2022';
with c as (insert into public.categories (board_id, position, name) values ('juli-2022', 0, 'Yrke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Rocket Man', 'Elton John', 'Astronaut', null, null, 0),
    (2, 'Sailing', 'Rod Stewart', 'Seiler', null, null, 0),
    (3, 'Brooklyn Nine-Nine Theme', '', 'Politi', null, null, 0),
    (4, 'Panda', 'Desiigner', 'Designer', null, null, 0),
    (5, 'Under Pressure', 'Queen', 'Dronning', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('juli-2022', 1, 'Fremkomstmiddel') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Super Max!', 'Pitstop Boys', 'Bil', null, null, 0),
    (2, 'I''m on a Boat', 'The Lonely Island', 'Båt', null, null, 0),
    (3, 'Dommedagen 2020', '', 'Sykkel', null, null, 0),
    (4, 'Creme de la creme', '', 'Kamel', null, null, 0),
    (5, 'Space Oddity', 'David Bowie', 'Romrakett', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('juli-2022', 2, 'Film/serie') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'The Good, the Bad and the Ugly', 'Ennio Morricone', 'The Good, the Bad and the Ugly', null, null, 0),
    (2, 'Shallow', 'Lady Gaga', 'A Star Is Born', null, null, 0),
    (3, 'My Shiny Teeth and Me', '', 'Fairly OddParents', null, null, 0),
    (4, 'Theme from Jurassic Park', 'John Williams', 'Jurassic Park', null, null, 0),
    (5, 'Here We Go (Totally Spies)', '', 'Totally Spies', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('juli-2022', 3, 'Farge') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Yellow', 'Coldplay', 'Gul', null, null, 0),
    (2, 'Mr. Blue Sky', 'Electric Light Orchestra', 'Blå', null, null, 0),
    (3, 'Red Right Hand', 'Nick Cave & The Bad Seeds', 'Rød', null, null, 0),
    (4, 'Treasure', 'Bruno Mars', 'Brun', null, null, 0),
    (5, 'Big Yellow Taxi', 'Joni Mitchell', 'Gul', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('juli-2022', 4, 'Alkohol') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Kjells Angels', '', 'Underberg', null, null, 0),
    (2, 'Tequila', 'The Champs', 'Tequila', null, null, 0),
    (3, 'Escape (The Piña Colada Song)', 'Rupert Holmes', 'Piña colada', null, null, 0),
    (4, 'Ølbriller', '', 'Øl', null, null, 0),
    (5, 'The Rhythm of the Night', 'Corona', 'Corona', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('juli-2022', 5, 'Mat/drikke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Waterloo', 'ABBA', 'Vann', null, null, 0),
    (2, 'Hummer og horer', '', 'Hummer', null, null, 0),
    (3, 'Californication', 'Red Hot Chili Peppers', 'Chili', null, null, 0),
    (4, 'Where Is the Love?', 'The Black Eyed Peas', 'Ert', null, null, 0),
    (5, 'Ice Ice Baby', 'Vanilla Ice', 'Vaniljeis', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('juli-2022', 6, 'Steder') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Italia', '', 'Italia', null, null, 0),
    (2, 'Africa', 'Toto', 'Afrika', null, null, 0),
    (3, 'Sør-Afrika', '', 'Sør-Afrika', null, null, 0),
    (4, 'Funkytown', 'Lipps Inc.', 'Funkytown', null, null, 0),
    (5, 'The Final Countdown', 'Europe', 'Europa', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('juli-2022', 7, 'Tall') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'I''m Gonna Be (500 Miles)', 'The Proclaimers', '500', null, null, 0),
    (2, 'What Makes You Beautiful', 'One Direction', '1', null, null, 0),
    (3, '32-18', '', '32-18', null, null, 0),
    (4, '99 Luftballons', 'Nena', '99', null, null, 0),
    (5, 'Mood', '24kGoldn', '24', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Musikkquiz desember 2022
insert into public.boards (id, name, description) values ('desember-2022', 'Musikkquiz desember 2022', 'Dyr, mat, menneskekroppen, grunnstoffer, film, farge, idrett og stat i USA.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'desember-2022';
with c as (insert into public.categories (board_id, position, name) values ('desember-2022', 0, 'Dyr') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Dance Monkey', 'Tones and I', 'Ape', null, null, 0),
    (2, 'Roar', 'Katy Perry', 'Tiger', null, null, 0),
    (3, 'Woman', 'Doja Cat', 'Katt', null, null, 0),
    (4, 'Hotel California', 'Eagles', 'Ørn', null, null, 0),
    (5, 'Eine kleine Nachtmusik', 'Wolfgang Amadeus Mozart', 'Ulv', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('desember-2022', 1, 'Mat') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Candy Paint', 'Post Malone', 'Godteri', null, null, 0),
    (2, 'Watermelon Sugar', 'Harry Styles', 'Vannmelon', null, null, 0),
    (3, 'Pour Some Sugar on Me', 'Def Leppard', 'Sukker', null, null, 0),
    (4, 'Fly Me to the Moon', 'Frank Sinatra', 'Mars-bar', null, null, 0),
    (5, 'Johnny B. Goode', 'Chuck Berry', 'Bær', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('desember-2022', 2, 'Menneskekroppen') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, '(I Just) Died in Your Arms', 'Cutting Crew', 'Arm', null, null, 0),
    (2, 'Hjerteløs', '', 'Hjerte', null, null, 0),
    (3, 'Iris', 'The Goo Goo Dolls', 'Iris', null, null, 0),
    (4, 'Funkytown', 'Lipps Inc.', 'Lepper', null, null, 0),
    (5, 'Brain Damage', 'Pink Floyd', 'Hjerne', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('desember-2022', 3, 'Grunnstoffer') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Titanium', 'David Guetta', 'Titan', null, null, 0),
    (2, 'Neon Lights', 'Demi Lovato', 'Neon', null, null, 0),
    (3, 'The Trooper', 'Iron Maiden', 'Jern', null, null, 0),
    (4, 'Asgeirs bil', '', 'Brom', null, null, 0),
    (5, '24K Magic', 'Bruno Mars', 'Gull', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('desember-2022', 4, 'Film/serie') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Circle of Life', 'Elton John', 'Løvenes konge', null, null, 0),
    (2, 'Raiders March', 'John Williams', 'Indiana Jones', null, null, 0),
    (3, 'Strange Things', 'Randy Newman', 'Toy Story', null, null, 0),
    (4, 'Time', 'Hans Zimmer', 'Inception', null, null, 0),
    (5, 'I''m Forrest... Forrest Gump', 'Alan Silvestri', 'Forrest Gump', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('desember-2022', 5, 'Farge') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Yellow Submarine', 'The Beatles', 'Gul', null, null, 0),
    (2, 'Mr. Blue Sky', 'Electric Light Orchestra', 'Blå', null, null, 0),
    (3, 'Smoke on the Water', 'Deep Purple', 'Lilla', null, null, 0),
    (4, 'Come and Get Your Love', 'Redbone', 'Rød', null, null, 0),
    (5, 'I Love Rock ''n'' Roll', 'Joan Jett & the Blackhearts', 'Svart', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('desember-2022', 6, 'Idrett') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Sail', 'AWOLNATION', 'Seiling', null, null, 0),
    (2, 'Jump', '', 'Hopp', null, null, 0),
    (3, 'Stolen Dance', 'Milky Chance', 'Dans', null, null, 0),
    (4, 'Faded', 'Alan Walker', 'Kappgang', null, null, 0),
    (5, 'The River', 'Bruce Springsteen', 'Løping', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('desember-2022', 7, 'Stat i USA') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Californication', 'Red Hot Chili Peppers', 'California', null, null, 0),
    (2, 'Englishman in New York', 'Sting', 'New York', null, null, 0),
    (3, 'Harleys in Hawaii', 'Katy Perry', 'Hawaii', null, null, 0),
    (4, 'He Could Be the One', 'Hannah Montana', 'Montana', null, null, 0),
    (5, 'My House', 'Flo Rida', 'Florida', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Musikkquiz mars 2023
insert into public.boards (id, name, description) values ('mars-2023', 'Musikkquiz mars 2023', 'Tall, dyr, yrke, fremkomstmiddel, farge, film, mat og stat i USA.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'mars-2023';
with c as (insert into public.categories (board_id, position, name) values ('mars-2023', 0, 'Tall') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'With or Without You', 'U2', '2', null, null, 0),
    (2, 'Like a G6', 'Far East Movement', '6', null, null, 0),
    (3, 'All the Small Things', 'blink-182', '182', null, null, 0),
    (4, 'Edge of Seventeen', 'Stevie Nicks', '17', null, null, 0),
    (5, 'Africa', 'Toto', '22', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2023', 1, 'Dyr') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Fireflies', 'Owl City', 'Ugle', null, null, 0),
    (2, 'Uprising', 'Muse', 'Mus', null, null, 0),
    (3, 'Cigarette Daydreams', 'Cage the Elephant', 'Elefant', null, null, 0),
    (4, 'Tití Me Preguntó', 'Bad Bunny', 'Kanin', null, null, 0),
    (5, 'Seven Nation Army', 'The White Stripes', 'Elefant', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2023', 2, 'Yrke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Stressed Out', 'Twenty One Pilots', 'Pilot', null, null, 0),
    (2, 'Another Brick in the Wall, Pt. 2', 'Pink Floyd', 'Lærer', null, null, 0),
    (3, 'New Light', 'John Mayer', 'Ordfører', null, null, 0),
    (4, 'Anti-Hero', 'Taylor Swift', 'Skredder', null, null, 0),
    (5, 'Breaking the Law', 'Judas Priest', 'Prest', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2023', 3, 'Fremkomstmiddel') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Nine Million Bicycles', 'Katie Melua', 'Sykkel', null, null, 0),
    (2, 'Crazy Train', 'Ozzy Osbourne', 'Tog', null, null, 0),
    (3, 'Sk8er Boi', 'Avril Lavigne', 'Skateboard', null, null, 0),
    (4, 'Creme de la creme', '', 'Kamel', null, null, 0),
    (5, 'Voi Voi', 'Nora Brockstedt', 'Elsparkesykkel', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2023', 4, 'Farge') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Hvite menn som pusher 50', 'Karpe', 'Hvit', null, null, 0),
    (2, 'Goodbye Yellow Brick Road', 'Elton John', 'Gul', null, null, 0),
    (3, 'Forever', 'Chris Brown', 'Brun', null, null, 0),
    (4, 'Sunday Morning', 'Maroon 5', 'Rødbrun (maroon)', null, null, 0),
    (5, '(Don''t Fear) The Reaper', 'Blue Öyster Cult', 'Blå', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2023', 5, 'Film/serie') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Game of Thrones Main Title', 'Ramin Djawadi', 'Game of Thrones', null, null, 0),
    (2, 'Dexter Main Title', 'Rolfe Kent', 'Dexter', null, null, 0),
    (3, 'Married Life', 'Michael Giacchino', 'Up', null, null, 0),
    (4, 'Wonderland', '', 'Alice i Eventyrland', null, null, 0),
    (5, 'Flying Theme (E.T.)', 'John Williams', 'E.T.', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2023', 6, 'Mat/drikke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Tequila', 'The Champs', 'Tequila', null, null, 0),
    (2, 'Have You Ever Seen the Rain', 'Creedence Clearwater Revival', 'Vann', null, null, 0),
    (3, 'The Chain', 'Fleetwood Mac', 'McDonald''s', null, null, 0),
    (4, 'Without Me', 'Eminem', 'M&M', null, null, 0),
    (5, 'You Make My Dreams', 'Daryl Hall & John Oates', 'Havregryn', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mars-2023', 7, 'Stat i USA') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Georgia on My Mind', 'Ray Charles', 'Georgia', null, null, 0),
    (2, 'Tennessee Whiskey', 'Chris Stapleton', 'Tennessee', null, null, 0),
    (3, 'Raiders March', 'John Williams', 'Indiana', null, null, 0),
    (4, 'Carry On Wayward Son', 'Kansas', 'Kansas', null, null, 0),
    (5, 'Teach Me How to Dougie', 'Cali Swag District', 'California', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Musikkquiz august 2023 (1/2)
insert into public.boards (id, name, description) values ('august-2023-1', 'Musikkquiz august 2023 (1/2)', 'Farge, tall, by, dyr, menneskekroppen, mat, alkohol og navn.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'august-2023-1';
with c as (insert into public.categories (board_id, position, name) values ('august-2023-1', 0, 'Farge') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'White Woman''s Instagram', 'Bo Burnham', 'Hvit', null, null, 0),
    (2, 'Paint the Town Red', 'Doja Cat', 'Rød', null, null, 0),
    (3, 'The Lady in Red', 'Chris de Burgh', 'Rød', null, null, 0),
    (4, 'Hej lilla gumman', '', 'Lilla', null, null, 0),
    (5, 'Gaffeltruck Driving Man', 'Black Debbath', 'Svart', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-1', 1, 'Tall') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Om 100 år er allting glemt', 'Jahn Teigen', '100', null, null, 0),
    (2, 'ABC', 'The Jackson 5', '5', null, null, 0),
    (3, 'I''m Not in Love', '10cc', '10', null, null, 0),
    (4, 'Cupid (Twin Ver.)', 'FIFTY FIFTY', '50', null, null, 0),
    (5, 'Feeling Myself', '', '23', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-1', 2, 'By') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Viva la Vida', 'Coldplay', 'Jerusalem', null, null, 0),
    (2, 'California Dreamin''', 'The Mamas & the Papas', 'Los Angeles', null, null, 0),
    (3, 'I Have Nothing', 'Whitney Houston', 'Houston', null, null, 0),
    (4, 'Take My Breath', 'The Weeknd', 'Berlin', null, null, 0),
    (5, 'If You Leave Me Now', 'Chicago', 'Chicago', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-1', 3, 'Dyr') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Hound Dog', 'Elvis Presley', 'Hund', null, null, 0),
    (2, 'I Wanna Be Yours', 'Arctic Monkeys', 'Ape', null, null, 0),
    (3, 'Say You, Say Me', 'Lionel Richie', 'Løve', null, null, 0),
    (4, 'Badebussen', '', 'Ku', null, null, 0),
    (5, 'Idiot', '', 'Panda', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-1', 4, 'Menneskekroppen') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'I''ve Got You Under My Skin', 'Frank Sinatra', 'Hud', null, null, 0),
    (2, 'Total Eclipse of the Heart', 'Bonnie Tyler', 'Hjerte', null, null, 0),
    (3, 'Bohemian Rhapsody', 'Queen', 'Hode', null, null, 0),
    (4, 'Creep', 'Radiohead', 'Hode', null, null, 0),
    (5, 'What Was I Made For?', 'Billie Eilish', 'Øyevipp', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-1', 5, 'Mat') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Stikk av ditt svin', '', 'Svin', null, null, 0),
    (2, 'Banana Boat (Day-O)', 'Harry Belafonte', 'Banan', null, null, 0),
    (3, 'Plastisk kirurgi', '', 'Leverpostei', null, null, 0),
    (4, 'Even Flow', 'Pearl Jam', 'Syltetøy', null, null, 0),
    (5, 'Behind Blue Eyes', 'Limp Bizkit', 'Kjeks', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-1', 6, 'Alkohol') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Red Red Wine', 'UB40', 'Rødvin', null, null, 0),
    (2, 'Jeg hater corona', '', 'Corona', null, null, 0),
    (3, 'Valhalla', '', 'Ringnes', null, null, 0),
    (4, 'Sommerhus', '', 'Dom Pérignon', null, null, 0),
    (5, 'Spirit in the Sky', 'Norman Greenbaum', 'Sprit', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-1', 7, 'Navn') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'I''m Just Ken', 'Ryan Gosling', 'Ken', null, null, 0),
    (2, 'Michelin stjerner', '', 'Michelin', null, null, 0),
    (3, 'Angie', 'The Rolling Stones', 'Angie', null, null, 0),
    (4, 'I Don''t Want to Miss a Thing', 'Aerosmith', 'Smith', null, null, 0),
    (5, 'Josefin', '', 'Josefin', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Musikkquiz august 2023 (2/2)
insert into public.boards (id, name, description) values ('august-2023-2', 'Musikkquiz august 2023 (2/2)', 'Grunnstoff, bilmerke, film, årstall, idrett, land, yrke og fremkomstmiddel.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'august-2023-2';
with c as (insert into public.categories (board_id, position, name) values ('august-2023-2', 0, 'Grunnstoff') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Pie Jesu', '', 'Sølv', null, null, 0),
    (2, 'Silikon i tatti', '', 'Silikon', null, null, 0),
    (3, 'Helium', 'Sia', 'Helium', null, null, 0),
    (4, 'O store Gud', '', 'Oksygen', null, null, 0),
    (5, 'The Way You Make Me Feel', 'Michael Jackson', 'Helium (hee hee)', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-2', 1, 'Bilmerke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Toyota Hiace', '', 'Toyota', null, null, 0),
    (2, 'Mercedes Benz', 'Janis Joplin', 'Mercedes-Benz', null, null, 0),
    (3, 'Den fineste Tesla''n', '', 'Tesla', null, null, 0),
    (4, 'Cruel Summer', 'Taylor Swift', 'Suzuki Swift', null, null, 0),
    (5, 'Poison', 'Alice Cooper', 'Mini Cooper', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-2', 2, 'Film/serie') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Ghostbusters', 'Ray Parker Jr.', 'Ghostbusters', null, null, 0),
    (2, 'Colors of the Wind', 'Vanessa Williams', 'Pocahontas', null, null, 0),
    (3, 'Danger Zone', 'Kenny Loggins', 'Top Gun', null, null, 0),
    (4, 'The Crown Main Title', 'Hans Zimmer', 'The Crown', null, null, 0),
    (5, 'Alice''s Theme', 'Danny Elfman', 'Alice i Eventyrland', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-2', 3, 'Årstall') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, '1999', 'Prince', '1999', null, null, 0),
    (2, '2002', 'Anne-Marie', '2002', null, null, 0),
    (3, '1985', 'Bowling for Soup', '1985', null, null, 0),
    (4, '1975', '', '1975', null, null, 0),
    (5, 'Blank Space', 'Taylor Swift', '1989', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-2', 4, 'Idrett') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Three Lions', 'Lightning Seeds', 'Fotball', null, null, 0),
    (2, 'Dance the Night Away', '', 'Dans', null, null, 0),
    (3, 'Butterflies', '', 'Butterfly (svømming)', null, null, 0),
    (4, 'Sprinter', 'Dave', 'Sprint', null, null, 0),
    (5, 'Haien kommer', '', 'Golf', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-2', 5, 'Land') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Italia', '', 'Italia', null, null, 0),
    (2, 'Wilhelmus van Nassouwe', '', 'Nederland', null, null, 0),
    (3, 'Lenge leve', 'Karpe', 'Egoland', null, null, 0),
    (4, 'Feel It Still', 'Portugal. The Man', 'Portugal', null, null, 0),
    (5, 'Take Me Out', 'Franz Ferdinand', 'Østerrike', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-2', 6, 'Yrke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Mr. Cab Driver', 'Lenny Kravitz', 'Taxisjåfør', null, null, 0),
    (2, 'Supermodel', '', 'Modell', null, null, 0),
    (3, 'Bartender', '', 'Bartender', null, null, 0),
    (4, 'Top of the World', 'The Carpenters', 'Snekker', null, null, 0),
    (5, 'Wonderful World', 'Sam Cooke', 'Kokk', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('august-2023-2', 7, 'Fremkomstmiddel') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Freight Train', '', 'Tog', null, null, 0),
    (2, 'Modedbart', '', 'Moped', null, null, 0),
    (3, 'Air Balloon', 'Lily Allen', 'Varmluftsballong', null, null, 0),
    (4, 'Parachutes', '', 'Fallskjerm', null, null, 0),
    (5, 'William Tell Overture', '', 'Hest', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Musikkquiz mai 2024
insert into public.boards (id, name, description) values ('mai-2024', 'Musikkquiz mai 2024', 'Tall, navn, sted, yrke, butikk, samplet artist, idrett og mat.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'mai-2024';
with c as (insert into public.categories (board_id, position, name) values ('mai-2024', 0, 'Tall') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Jenter', '', '89', null, null, 0),
    (2, 'One Last Time', 'Ariana Grande', '1', null, null, 0),
    (3, 'Sk8er Boi', 'Avril Lavigne', '8', null, null, 0),
    (4, 'Dans med meg', '', '101', null, null, 0),
    (5, 'Fortnight', 'Taylor Swift', '14', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2024', 1, 'Navn') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Pedro', '', 'Pedro', null, null, 0),
    (2, 'Valerie', 'Amy Winehouse', 'Valerie', null, null, 0),
    (3, 'Situasjon', '', 'Sindre Finnes', null, null, 0),
    (4, 'Casino', '', 'Mbappé', null, null, 0),
    (5, 'If I Were a Boy', 'Beyoncé', 'Sasha Fierce', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2024', 2, 'Sted') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Texas Hold ''Em', 'Beyoncé', 'Texas', null, null, 0),
    (2, 'Budapest', 'George Ezra', 'Budapest', null, null, 0),
    (3, 'Florida!!!', 'Taylor Swift', 'Florida', null, null, 0),
    (4, 'The Final Countdown', 'Europe', 'Europa', null, null, 0),
    (5, 'Dog Days Are Over', 'Florence + The Machine', 'Firenze', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2024', 3, 'Yrke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'The Man Who Can''t Be Moved', 'The Script', 'Politi', null, null, 0),
    (2, 'Tore Tang', '', 'Spelemann', null, null, 0),
    (3, 'Snakke litt', '', 'Admiral', null, null, 0),
    (4, 'Clocks', 'Coldplay', 'Urmaker', null, null, 0),
    (5, 'Mr. Brightside', 'The Killers', 'Leiemorder', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2024', 4, 'Butikk/bedrift') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'The Joker', 'Steve Miller Band', 'Joker', null, null, 0),
    (2, 'Sharp Dressed Man', 'ZZ Top', 'Dressmann', null, null, 0),
    (3, 'Dancing On My Own', 'Robyn', 'Corner', null, null, 0),
    (4, 'Kiwi', 'Harry Styles', 'Kiwi', null, null, 0),
    (5, 'Drive', 'Incubus', 'Cubus', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2024', 5, 'Samplet artist') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'That Way', '', 'Backstreet Boys', null, null, 0),
    (2, 'I''ll Be Missing You', 'Puff Daddy', 'The Police', null, null, 0),
    (3, 'Tenke sjæl', '', 'Trond-Viggo Torgersen', null, null, 0),
    (4, 'Feite damer', '', 'Belinda Carlisle', null, null, 0),
    (5, 'I Don''t Wanna Wait', 'David Guetta', 'O-Zone', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2024', 6, 'Idrett') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Æ vil bare dans', '', 'Dans', null, null, 0),
    (2, 'Born to Run', 'Bruce Springsteen', 'Løping', null, null, 0),
    (3, 'Total Eclipse of the Heart', 'Bonnie Tyler', 'Turn', null, null, 0),
    (4, 'Circus', 'Britney Spears', 'Spydkast', null, null, 0),
    (5, 'Just Do It', '', 'Nike', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2024', 7, 'Mat/drikke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Espresso', 'Sabrina Carpenter', 'Espresso', null, null, 0),
    (2, 'Lady Marmalade', 'Christina Aguilera', 'Syltetøy', null, null, 0),
    (3, 'Sugar, We''re Goin Down', 'Fall Out Boy', 'Sukker', null, null, 0),
    (4, 'Haven''t Met You Yet', 'Michael Bublé', 'Bobler', null, null, 0),
    (5, 'Bleeding Love', 'Leona Lewis', 'Sprit', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Musikkquiz mai 2025
insert into public.boards (id, name, description) values ('mai-2025', 'Musikkquiz mai 2025', 'Dødsårsaker, hobbier, natur, spill, steder og mote.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'mai-2025';
with c as (insert into public.categories (board_id, position, name) values ('mai-2025', 0, 'Dødsårsaker') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Poison', '', 'Gift', null, null, 0),
    (2, 'Pompeii', 'Bastille', 'Vulkan', null, null, 0),
    (3, 'Tsunami', 'DVBBS', 'Tsunami', null, null, 0),
    (4, 'Pumped Up Kicks', 'Foster the People', 'Skoleskyting', null, null, 0),
    (5, 'Moonlight Shadow', 'Mike Oldfield', 'Alderdom', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2025', 1, 'Hobbier') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Stamp on the Ground', 'ItaloBrothers', 'Frimerker', null, null, 0),
    (2, 'Total Eclipse of the Heart', 'Bonnie Tyler', 'Turn', null, null, 0),
    (3, 'Runaway Baby', 'Bruno Mars', 'Løping', null, null, 0),
    (4, 'Even Flow', 'Pearl Jam', 'Perling', null, null, 0),
    (5, 'Too Little Too Late', 'JoJo', 'Jojo', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2025', 2, 'Natur') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Touch Grass', '', 'Gress', null, null, 0),
    (2, 'Lemon Tree', 'Fools Garden', 'Sitrontre', null, null, 0),
    (3, 'Running Up That Hill', 'Kate Bush', 'Busk', null, null, 0),
    (4, 'You Can''t Always Get What You Want', 'The Rolling Stones', 'Stein', null, null, 0),
    (5, 'Jeg vil ha', '', 'Fjell', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2025', 3, 'Spill') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Yatzy', '', 'Yatzy', null, null, 0),
    (2, 'Casino', '', 'Casino', null, null, 0),
    (3, 'I Know You Want Me (Calle Ocho)', 'Pitbull', 'Uno', null, null, 0),
    (4, 'Monopoly', 'Ariana Grande', 'Monopol', null, null, 0),
    (5, 'Mafia', '', 'Mafia', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2025', 4, 'Steder') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Take Me Home, Country Roads', 'John Denver', 'West Virginia', null, null, 0),
    (2, 'Garden of Eden', '', 'Edens hage', null, null, 0),
    (3, 'Welcome to the Jungle', 'Guns N'' Roses', 'Jungel', null, null, 0),
    (4, 'As Long as You Love Me', 'Backstreet Boys', 'Bakgate', null, null, 0),
    (5, 'We Are the World', 'USA for Africa', 'USA', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('mai-2025', 5, 'Mote') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Billie Jean', 'Michael Jackson', 'Bukse (jeans)', null, null, 0),
    (2, 'Blue Suede Shoes', 'Elvis Presley', 'Semskede sko', null, null, 0),
    (3, 'Don''t Let Me Down', 'The Chainsmokers', 'Halskjede', null, null, 0),
    (4, 'Under Pressure', 'Queen', 'Sløyfe', null, null, 0),
    (5, 'Greenback Boogie', 'Ima Robot', 'Dress', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);

-- Musikkquiz september 2026 (under arbeid)
insert into public.boards (id, name, description) values ('september-2026', 'Musikkquiz september 2026 (under arbeid)', 'Fire ferdige kategorier. Navn, tall, yrke, film og app er ikke fylt ut enda.') on conflict (id) do update set name = excluded.name, description = excluded.description;
delete from public.categories where board_id = 'september-2026';
with c as (insert into public.categories (board_id, position, name) values ('september-2026', 0, 'Tall') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (3, '2003, en butikk-odyssé', '', '2003', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('september-2026', 1, 'Mat/drikke') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Smak av honning', '', 'Honning', null, null, 0),
    (2, 'Hest er best som pålegg', '', 'Hest', null, null, 0),
    (3, 'Hey Baby', '', 'Te', null, null, 0),
    (4, 'Chop Suey!', 'System of a Down', 'Chop suey', null, null, 0),
    (5, 'Drop It Like It''s Hot', 'Snoop Dogg', 'Snop', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('september-2026', 2, 'Fremkomstmiddel') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Gaffeltruck Driving Man', 'Black Debbath', 'Gaffeltruck', null, null, 0),
    (2, 'Paper Planes', 'M.I.A.', 'Fly', null, null, 0),
    (3, 'Break Your Heart', 'Taio Cruz', 'Cruiseskip', null, null, 0),
    (4, 'Meditation', '', 'Heis', null, null, 0),
    (5, 'We Built This City', 'Starship', 'Romskip', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('september-2026', 3, 'Film/serie') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (4, 'In da Club', '50 Cent', 'Get Rich or Die Tryin''', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('september-2026', 4, 'Spill') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Poker Face', 'Lady Gaga', 'Poker', null, null, 0),
    (2, 'Monopoly', 'Ariana Grande', 'Monopol', null, null, 0),
    (3, 'Wow.', 'Post Malone', 'World of Warcraft', null, null, 0),
    (4, 'Let Me Love You', 'Mario', 'Super Mario', null, null, 0),
    (5, 'Peaches', 'Jack Black', 'Blackjack', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('september-2026', 5, 'App') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'TikTok', 'Kesha', 'TikTok', null, null, 0),
    (3, 'SAS Plus/SAS Pussy', '', 'SAS', null, null, 0),
    (4, 'Numb', 'Linkin Park', 'LinkedIn', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
with c as (insert into public.categories (board_id, position, name) values ('september-2026', 6, 'Grunnstoffer') returning id)
insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)
select c.id, v.* from c, (values
    (1, 'Chlorine', 'Twenty One Pilots', 'Klor', null, null, 0),
    (2, 'Sink', '', 'Sink', null, null, 0),
    (3, 'How You Remind Me', 'Nickelback', 'Nikkel', null, null, 0),
    (4, 'Kryptonite', '3 Doors Down', 'Krypton', null, null, 0),
    (5, 'Bohemian Rhapsody', 'Queen', 'Kvikksølv (Mercury)', null, null, 0)
  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);
