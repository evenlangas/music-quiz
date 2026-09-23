// Merket: en ø tegnet som en plate, der skråstreken også er tonearmen.
export function Mark({ size = 40 }: { size?: number }) {
  return (
    <svg className="mark" viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--kritt)" strokeWidth="9" />
      <circle cx="50" cy="50" r="22" fill="none" stroke="var(--strek)" strokeWidth="3" />
      <line x1="17" y1="83" x2="83" y2="17" stroke="var(--signal)" strokeWidth="11" strokeLinecap="round" />
    </svg>
  )
}
