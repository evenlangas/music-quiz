// Innholdet i QR-kodene. Rå id-er med prefiks, ikke lenker: kodene skannes bare
// fra appen, og prefikset gjør at vi kan si ifra om feil kode.
//
//   Boks:  GEHOR:BOX:<hemmelig kode>
//   Brett: GEHOR:BOARD:<brett-id>

export type CodeKind = 'box' | 'board'

const PREFIX: Record<CodeKind, string> = { box: 'GEHOR:BOX:', board: 'GEHOR:BOARD:' }

export function parseCode(text: string): { kind: CodeKind; value: string } | null {
  const t = text.trim()
  for (const kind of ['box', 'board'] as const) {
    if (t.toUpperCase().startsWith(PREFIX[kind])) {
      const value = t.slice(PREFIX[kind].length).trim()
      if (value) return { kind, value }
    }
  }
  return null
}

export const encodeCode = (kind: CodeKind, value: string) => PREFIX[kind] + value
