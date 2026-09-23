// Lager QR-koder for testboksene og alle brett, som SVG og PNG i qr/,
// og et utskriftsark i qr/index.html.
//
//   node tools/make-qr.mjs

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import QRCode from 'qrcode'
import { boxes } from './boxes.mjs'

const root = new URL('../', import.meta.url)
const out = new URL('qr/', root)
mkdirSync(out, { recursive: true })

const boardIds = JSON.parse(readFileSync(new URL('content/boards/index.json', root), 'utf8'))
const boards = boardIds.map((id) => JSON.parse(readFileSync(new URL(`content/boards/${id}.json`, root), 'utf8')))

const items = [
  ...boxes.map((b, i) => ({ file: `boks-${i + 1}`, kind: 'Boks', title: b.label, payload: `GEHOR:BOX:${b.code}`, note: 'Inni boksen. Hemmelig.' })),
  ...boards.map((b) => ({
    file: `brett-${b.id}`,
    kind: 'Brett',
    title: b.name,
    payload: `GEHOR:BOARD:${b.id}`,
    note: b.categories.map((c) => c.name).join(' · '),
  })),
]

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const opts = { errorCorrectionLevel: 'M', margin: 2 }
const cards = []
for (const it of items) {
  const svg = await QRCode.toString(it.payload, { ...opts, type: 'svg' })
  writeFileSync(new URL(`${it.file}.svg`, out), svg)
  await QRCode.toFile(new URL(`${it.file}.png`, out).pathname, it.payload, { ...opts, width: 600 })
  cards.push(`<figure class="${it.kind.toLowerCase()}">${svg}<figcaption><b>${esc(it.kind)}: ${esc(it.title)}</b><small>${esc(it.note)}</small><code>${esc(it.payload)}</code></figcaption></figure>`)
}

writeFileSync(
  new URL('index.html', out),
  `<!doctype html><html lang="no"><meta charset="utf-8"><title>Gehør QR-koder</title>
<style>
body{font:14px system-ui,sans-serif;margin:24px;color:#111;background:#fff}
h1{font-size:20px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px}
figure{margin:0;border:1px solid #ccc;border-radius:12px;padding:12px;break-inside:avoid;text-align:center}
figure.boks{border:3px solid #f2a93b}svg{width:100%;height:auto}
figcaption{display:flex;flex-direction:column;gap:4px}small{color:#555}code{font-size:10px;color:#888;word-break:break-all}
</style>
<h1>Gehør – QR-koder til testing</h1>
<p>Skann med «Skann boksen» / «Skann brettet» i appen. Oransje ramme = boks.</p>
<main>${cards.join('\n')}</main></html>`,
)
console.log(`Skrev ${items.length} QR-koder til qr/`)
