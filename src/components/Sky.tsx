import { useEffect, useRef, type FC } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';
import { useTheme } from '../context/ThemeContext';
import { phaseOf, seasonAccent, seasonOf, skyColors, sunProgress, type Phase } from '../sky/atmosphere';
import { calculateSunTimes } from '../utils/sunTimesUtils';
import { useForecast } from '../utils/weather';

function clockMinutes(value: string): number {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function moonPhase(year: number, month: number, day: number): number {
  const n = Math.round((Date.UTC(year, month - 1, day) - Date.UTC(2000, 0, 6)) / 86_400_000);
  return ((n % 29.53) + 29.53) % 29.53 / 29.53;
}

const Sky: FC = () => {
  const { now, today, country, region } = useWeekData();
  const { isDark } = useTheme();
  const { forecast } = useForecast(country, region);
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sun = calculateSunTimes(today);
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Vienna', hour: '2-digit', hourCycle: 'h23' }).format(now));
  const minute = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Vienna', minute: '2-digit' }).format(now));
  const safeHour = hour === 24 ? 0 : hour;
  const minutes = safeHour * 60 + minute;
  const season = seasonOf(today.getMonth() + 1);
  const phase: Phase = phaseOf(minutes, clockMinutes(sun.sunrise), clockMinutes(sun.sunset));
  const [skyTop, skyMid, skyBottom] = skyColors(season, phase, forecast?.kind ?? null);
  const progress = sunProgress(minutes, clockMinutes(sun.sunrise), clockMinutes(sun.sunset));
  const kind = forecast?.kind ?? 'clear';

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.phase = phase;
    root.dataset.season = season;
    root.style.setProperty('--sky-0', skyTop);
    root.style.setProperty('--sky-1', skyMid);
    root.style.setProperty('--sky-2', skyBottom);
    if (!isDark) root.style.setProperty('--accent', seasonAccent(season));
    else root.style.removeProperty('--accent');
    const theme = document.querySelector('meta[name="theme-color"]');
    theme?.setAttribute('content', skyTop);
  }, [isDark, phase, season, skyBottom, skyMid, skyTop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let frame = 0;
    let stopped = false;
    const particles = Array.from({ length: 48 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      s: 0.4 + (index % 7) * 0.15,
      v: 0.15 + (index % 5) * 0.05,
      drift: (index % 2 === 0 ? 1 : -1) * (0.02 + (index % 4) * 0.01),
    }));

    const draw = (time: number) => {
      if (stopped) return;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      if (phase === 'night' || phase === 'dusk' || phase === 'dawn') {
        const phaseAmount = moonPhase(today.getFullYear(), today.getMonth() + 1, today.getDate());
        context.fillStyle = phase === 'night' ? 'rgba(244,239,228,0.85)' : 'rgba(244,239,228,0.35)';
        for (let i = 0; i < 40; i += 1) {
          const x = ((i * 97) % 1000) / 1000 * width;
          const y = ((i * 57) % 700) / 700 * height * 0.7;
          const twinkle = reduce ? 0.7 : 0.45 + Math.sin(time / 700 + i) * 0.35;
          context.globalAlpha = twinkle;
          context.fillRect(x, y, i % 5 === 0 ? 2 : 1.2, i % 5 === 0 ? 2 : 1.2);
        }
        context.globalAlpha = 1;
        const moonX = width * 0.78;
        const moonY = height * 0.16;
        context.beginPath();
        context.fillStyle = '#f4efe4';
        context.arc(moonX, moonY, 18, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.fillStyle = skyTop;
        context.globalAlpha = 0.92;
        context.arc(moonX + (phaseAmount < 0.5 ? 10 : -10) * Math.cos(phaseAmount * Math.PI * 2), moonY, 16, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
      }

      if (phase !== 'night' && kind !== 'fog' && kind !== 'storm') {
        const sunX = width * (0.12 + progress * 0.76);
        const sunY = height * 0.78 - Math.sin(progress * Math.PI) * height * 0.5;
        const glow = context.createRadialGradient(sunX, sunY, 8, sunX, sunY, 90);
        glow.addColorStop(0, 'rgba(255, 220, 140, 0.95)');
        glow.addColorStop(1, 'rgba(255, 220, 140, 0)');
        context.fillStyle = glow;
        context.beginPath();
        context.arc(sunX, sunY, 90, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#fff4d2';
        context.beginPath();
        context.arc(sunX, sunY, 16, 0, Math.PI * 2);
        context.fill();
      }

      if (kind === 'cloud' || kind === 'rain' || kind === 'storm' || kind === 'fog') {
        context.fillStyle = kind === 'fog' ? 'rgba(236,232,226,0.45)' : 'rgba(255,255,255,0.28)';
        for (let i = 0; i < (kind === 'fog' ? 5 : 3); i += 1) {
          const shift = reduce ? 0 : ((time / 80) * (0.15 + i * 0.05)) % (width + 200);
          const x = -180 + ((i * 280 + shift) % (width + 360));
          const y = 40 + i * 36;
          context.beginPath();
          context.ellipse(x, y, 90, 28, 0, 0, Math.PI * 2);
          context.ellipse(x + 50, y + 6, 70, 24, 0, 0, Math.PI * 2);
          context.fill();
        }
      }

      const falling = kind === 'rain' || kind === 'snow' || kind === 'storm' || (season === 'autumn' && kind === 'clear') || (season === 'spring' && phase === 'morning');
      if (falling) {
        particles.forEach((particle, index) => {
          const speed = kind === 'snow' ? particle.v * 0.35 : kind === 'rain' || kind === 'storm' ? particle.v * 2.4 : particle.v * 0.45;
          const y = reduce ? particle.y * height : ((particle.y * height + time * speed * 0.08) % (height + 20)) - 10;
          const x = reduce ? particle.x * width : (particle.x * width + Math.sin(time / 900 + index) * 12 + particle.drift * time * 0.02) % width;
          if (kind === 'snow') {
            context.fillStyle = 'rgba(255,255,255,0.85)';
            context.beginPath();
            context.arc(x, y, particle.s * 2.2, 0, Math.PI * 2);
            context.fill();
          } else if (kind === 'rain' || kind === 'storm') {
            context.strokeStyle = 'rgba(210, 224, 236, 0.55)';
            context.lineWidth = 1.2;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x - 2, y + 12);
            context.stroke();
          } else if (season === 'autumn') {
            context.fillStyle = index % 2 === 0 ? 'rgba(194, 84, 28, 0.75)' : 'rgba(212, 160, 48, 0.75)';
            context.beginPath();
            context.ellipse(x, y, 5, 3, time / 400 + index, 0, Math.PI * 2);
            context.fill();
          } else {
            context.fillStyle = 'rgba(244, 184, 204, 0.8)';
            context.beginPath();
            context.ellipse(x, y, 4, 2.4, time / 500 + index, 0, Math.PI * 2);
            context.fill();
          }
        });
      }

      if (kind === 'storm' && !reduce && Math.sin(time / 180) > 0.97) {
        context.fillStyle = 'rgba(255,255,255,0.18)';
        context.fillRect(0, 0, width, height);
      }

      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);
    const onHide = () => {
      if (document.hidden) {
        stopped = true;
        window.cancelAnimationFrame(frame);
      } else if (stopped) {
        stopped = false;
        frame = window.requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [kind, phase, progress, reduce, season, skyTop, today]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default Sky;
