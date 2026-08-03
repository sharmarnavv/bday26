import { useState, useEffect } from 'react'
import { NightSky } from './components/NightSky'
import { PixelNav } from './components/PixelNav'
import { Home } from './pages/Home'
import { Wishes } from './pages/Wishes'
import { Memories } from './pages/Memories'
import { Cake } from './pages/Cake'
import { Celebrate } from './pages/Celebrate'
import { useRoute } from './router'
import type { TimeLeft } from './components/Countdown'
import './index.css'

// ─── Birthday (unchanged logic) ───────────────────────────────────────────────
const BIRTHDAY = new Date('2026-08-05T00:00:00')

function calcTimeLeft(): TimeLeft {
  const d = BIRTHDAY.getTime() - Date.now()
  if (d <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(d / 86400000),
    hours:   Math.floor((d % 86400000) / 3600000),
    minutes: Math.floor((d % 3600000)  / 60000),
    seconds: Math.floor((d % 60000)    / 1000),
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft)
  const isPast = BIRTHDAY.getTime() <= Date.now()
  const route = useRoute()

  // Tick every second — countdown logic unchanged
  useEffect(() => {
    if (isPast) return
    const iv = setInterval(() => setTimeLeft(calcTimeLeft()), 1000)
    return () => clearInterval(iv)
  }, [isPast])

  return (
    <div className="scene">
      {/* NightSky: full-canvas pixel art background, shared by every page */}
      <NightSky />

      <main className="page-layer">
        {route === 'home'      && <Home timeLeft={timeLeft} isPast={isPast} />}
        {route === 'wishes'    && <Wishes />}
        {route === 'memories'  && <Memories />}
        {route === 'cake'      && <Cake />}
        {route === 'celebrate' && <Celebrate />}
      </main>

      <PixelNav route={route} />
    </div>
  )
}
