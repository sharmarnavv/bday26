import NumberFlow from '@number-flow/react'

// ─── Countdown ────────────────────────────────────────────────────────────────
// Countdown logic is UNCHANGED from original. Only presentation is redesigned.

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const FLOW_PROPS = {
  format: { minimumIntegerDigits: 2, notation: 'standard' } as const,
  transformTiming: { duration: 800, easing: 'cubic-bezier(0.25,0.1,0.25,1)' },
  spinTiming:      { duration: 800, easing: 'cubic-bezier(0.25,0.1,0.25,1)' },
  opacityTiming:   { duration: 380, easing: 'ease' },
  trend: -1 as const,
}

interface UnitProps { value: number; label: string }

function Unit({ value, label }: UnitProps) {
  return (
    <div className="cd-unit">
      <NumberFlow value={value} {...FLOW_PROPS} className="cd-digit" />
      <span className="cd-label">{label}</span>
    </div>
  )
}

interface CountdownProps { timeLeft: TimeLeft }

export function Countdown({ timeLeft }: CountdownProps) {
  return (
    <div className="cd-root" role="timer" aria-label="Time until birthday">
      <Unit value={timeLeft.days}    label="days"    />
      <span className="cd-sep" aria-hidden>:</span>
      <Unit value={timeLeft.hours}   label="hours"   />
      <span className="cd-sep" aria-hidden>:</span>
      <Unit value={timeLeft.minutes} label="min"     />
      <span className="cd-sep" aria-hidden>:</span>
      <Unit value={timeLeft.seconds} label="sec"     />
    </div>
  )
}
