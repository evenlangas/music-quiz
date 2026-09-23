// Lager supabase/seed.sql fra brett i JSON-format (samme format som Gehør v1)
// og en liste med testbokser.
//
//   node tools/make-seed.mjs <mappe-med-brett>
//
// Mappa må ha en index.json med brett-id-er, og én <id>.json per brett.
// Valgfritt: uris.json ({ "<brett>/<kategori>/<vanskelighetsgrad>": "spotify:track:..." }).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { boxes } from './boxes.mjs';

const dir = process.argv[2];
if (!dir) {
  console.error('Bruk: node tools/make-seed.mjs <mappe-med-brett>');
  process.exit(1);
}

const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replaceAll("'", "''")}'`);
const read = (f) => JSON.parse(readFileSync(join(dir, f), 'utf8'));

const ids = read('index.json');
const uris = existsSync(join(dir, 'uris.json')) ? read('uris.json') : {};

const out = [
  '-- Generert av tools/make-seed.mjs. Ikke rediger for hånd.',
  '',
  'insert into public.boxes (code, label) values',
  boxes.map((b) => `  (${q(b.code)}, ${q(b.label)})`).join(',\n') + '\non conflict (code) do nothing;',
  '',
];

for (const id of ids) {
  const b = read(`${id}.json`);
  out.push(`-- ${b.name}`);
  out.push(
    `insert into public.boards (id, name, description) values (${q(b.id)}, ${q(b.name)}, ${q(b.description)})` +
      ' on conflict (id) do update set name = excluded.name, description = excluded.description;',
  );
  out.push(`delete from public.categories where board_id = ${q(b.id)};`);
  b.categories.forEach((c, pos) => {
    const songs = c.songs
      .map((s) => {
        const uri = s.uri ?? uris[`${b.id}/${c.name}/${s.difficulty}`] ?? null;
        return `(${s.difficulty}, ${q(s.title)}, ${q(s.artist ?? '')}, ${q(s.answer)}, ${q(s.why)}, ${q(uri)}, ${s.startMs ?? 0})`;
      })
      .join(',\n    ');
    out.push(
      `with c as (insert into public.categories (board_id, position, name) values (${q(b.id)}, ${pos}, ${q(c.name)}) returning id)\n` +
        `insert into public.songs (category_id, difficulty, title, artist, answer, why, spotify_uri, start_ms)\n` +
        `select c.id, v.* from c, (values\n    ${songs}\n  ) as v(difficulty, title, artist, answer, why, spotify_uri, start_ms);`,
    );
  });
  out.push('');
}

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), out.join('\n'));
console.log(`Skrev ${ids.length} brett og ${boxes.length} bokser til supabase/seed.sql`);
