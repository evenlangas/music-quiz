// Lager en ny boks: en tilfeldig, hemmelig kode, SQL-en som legger den inn,
// og QR-koden som skal ligge i boksen.
//
//   node tools/new-box.mjs "Boks 17"

import { randomBytes } from 'node:crypto'
import QRCode from 'qrcode'

const label = process.argv[2]
if (!label) {
  console.error('Bruk: node tools/new-box.mjs "<navn>"')
  process.exit(1)
}
const code = randomBytes(10).toString('base64url')
const file = `boks-${code}.png`
await QRCode.toFile(file, `GEHOR:BOX:${code}`, { errorCorrectionLevel: 'M', margin: 2, width: 600 })
console.log(`Kjør i Supabase SQL Editor:\n\ninsert into public.boxes (code, label) values ('${code}', '${label.replaceAll("'", "''")}');\n\nQR-kode: ${file}`)
