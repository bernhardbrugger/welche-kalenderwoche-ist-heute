import type { SkyWeather } from '../utils/weather';

export type Phase = 'night' | 'dawn' | 'morning' | 'afternoon' | 'dusk';
export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export function seasonOf(month: number): Season {
  if (month === 12 || month <= 2) return 'winter';
  if (month <= 5) return 'spring';
  if (month <= 8) return 'summer';
  return 'autumn';
}

export function phaseOf(minutes: number, sunrise: number, sunset: number): Phase {
  if (minutes < sunrise - 50 || minutes > sunset + 40) return 'night';
  if (minutes < sunrise + 70) return 'dawn';
  if (minutes > sunset - 70) return 'dusk';
  if (minutes < 12 * 60) return 'morning';
  return 'afternoon';
}

export const PHASE_NAME: Record<Phase, string> = {
  night: 'Nacht',
  dawn: 'Dämmerung',
  morning: 'Morgen',
  afternoon: 'Nachmittag',
  dusk: 'Abend',
};

export const SKY_LABEL: Record<Season, Record<Phase, string>> = {
  winter: { night: 'Winternacht', dawn: 'Winterdämmerung', morning: 'Wintermorgen', afternoon: 'Winternachmittag', dusk: 'Winterabend' },
  spring: { night: 'Frühlingsnacht', dawn: 'Frühlingsdämmerung', morning: 'Frühlingsmorgen', afternoon: 'Frühlingsnachmittag', dusk: 'Frühlingsabend' },
  summer: { night: 'Sommernacht', dawn: 'Sommerdämmerung', morning: 'Sommermorgen', afternoon: 'Sommernachmittag', dusk: 'Sommerabend' },
  autumn: { night: 'Herbstnacht', dawn: 'Herbstdämmerung', morning: 'Herbstmorgen', afternoon: 'Herbstnachmittag', dusk: 'Herbstabend' },
};

export const SEASON_NAME: Record<Season, string> = {
  winter: 'Winter',
  spring: 'Frühling',
  summer: 'Sommer',
  autumn: 'Herbst',
};

type Gradient = [string, string, string];

const SKY: Record<Season, Record<Phase, Gradient>> = {
  winter: {
    night: ['#070b16', '#12182a', '#1c2438'],
    dawn: ['#2c3a55', '#d08a78', '#f0d2b4'],
    morning: ['#9eb4c8', '#d5dde6', '#efe6d6'],
    afternoon: ['#7ea4c4', '#d7e4ee', '#f3ead8'],
    dusk: ['#243044', '#c46a58', '#f0b48a'],
  },
  spring: {
    night: ['#10182c', '#243048', '#3a3050'],
    dawn: ['#3a4a72', '#f0a0b4', '#f8d7b4'],
    morning: ['#7ec0ea', '#d7f0c8', '#f7f3d8'],
    afternoon: ['#49a4e8', '#c6ecb4', '#fff2c4'],
    dusk: ['#3a3a68', '#e88878', '#f8c48a'],
  },
  summer: {
    night: ['#0c1430', '#1a2450', '#2a2060'],
    dawn: ['#3a5a90', '#f0b090', '#ffe0b0'],
    morning: ['#3d9df0', '#b7e4ff', '#fff0c4'],
    afternoon: ['#1f78e0', '#7ec8ff', '#ffe28a'],
    dusk: ['#3a2870', '#e85a48', '#ffb060'],
  },
  autumn: {
    night: ['#120e14', '#2a1c18', '#3a2820'],
    dawn: ['#3e3a58', '#e08860', '#f3c49a'],
    morning: ['#8ea0ae', '#d9c2a6', '#f3e2cc'],
    afternoon: ['#6e8eaa', '#e4c49a', '#f6e2c2'],
    dusk: ['#3a3058', '#d25a38', '#f0a068'],
  },
};

const ACCENT: Record<Season, string> = {
  winter: '#1f5f8a',
  spring: '#1f7a48',
  summer: '#d25a12',
  autumn: '#c2410c',
};

function mix(hex: string, toward: string, amount: number): string {
  const parse = (value: string) => [
    parseInt(value.slice(1, 3), 16),
    parseInt(value.slice(3, 5), 16),
    parseInt(value.slice(5, 7), 16),
  ];
  const [r, g, b] = parse(hex);
  const [tr, tg, tb] = parse(toward);
  const channel = (from: number, to: number) => Math.round(from + (to - from) * amount);
  return `#${[channel(r, tr), channel(g, tg), channel(b, tb)].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

export function skyColors(season: Season, phase: Phase, kind: SkyWeather | null): Gradient {
  const base = SKY[season][phase];
  if (!kind || kind === 'clear') return base;
  const amount = kind === 'fog' ? 0.55 : kind === 'storm' ? 0.45 : kind === 'cloud' ? 0.28 : 0.18;
  const gray = phase === 'night' ? '#1a1e28' : '#b7b1a8';
  return base.map((stop) => mix(stop, gray, amount)) as Gradient;
}

export function seasonAccent(season: Season): string {
  return ACCENT[season];
}

export function sunProgress(minutes: number, sunrise: number, sunset: number): number {
  if (sunset <= sunrise) return 0.5;
  return Math.min(1, Math.max(0, (minutes - sunrise) / (sunset - sunrise)));
}
