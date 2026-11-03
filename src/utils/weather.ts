import { useEffect, useState } from 'react';
import type { Country } from './holidayUtils';

export type SkyWeather = 'clear' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm';

export interface Place {
  name: string;
  lat: number;
  lon: number;
}

export interface Forecast {
  place: string;
  temperature: number;
  code: number;
  label: string;
  kind: SkyWeather;
  high: number;
  low: number;
  rainChance: number | null;
}

const PLACES: Record<string, Place> = {
  'AT:wien': { name: 'Wien', lat: 48.208, lon: 16.373 },
  'AT:noe': { name: 'St. Pölten', lat: 48.204, lon: 15.623 },
  'AT:ooe': { name: 'Linz', lat: 48.306, lon: 14.286 },
  'AT:sbg': { name: 'Salzburg', lat: 47.809, lon: 13.055 },
  'AT:tir': { name: 'Innsbruck', lat: 47.269, lon: 11.404 },
  'AT:vbg': { name: 'Bregenz', lat: 47.503, lon: 9.747 },
  'AT:ktn': { name: 'Klagenfurt', lat: 46.624, lon: 14.305 },
  'AT:stm': { name: 'Graz', lat: 47.071, lon: 15.438 },
  'AT:bgl': { name: 'Eisenstadt', lat: 47.846, lon: 16.518 },
  'DE:bw': { name: 'Stuttgart', lat: 48.775, lon: 9.183 },
  'DE:by': { name: 'München', lat: 48.137, lon: 11.575 },
  'DE:be': { name: 'Berlin', lat: 52.52, lon: 13.405 },
  'DE:bb': { name: 'Potsdam', lat: 52.391, lon: 13.063 },
  'DE:hb': { name: 'Bremen', lat: 53.079, lon: 8.801 },
  'DE:hh': { name: 'Hamburg', lat: 53.551, lon: 9.994 },
  'DE:he': { name: 'Wiesbaden', lat: 50.083, lon: 8.24 },
  'DE:mv': { name: 'Schwerin', lat: 53.629, lon: 11.414 },
  'DE:ni': { name: 'Hannover', lat: 52.375, lon: 9.732 },
  'DE:nw': { name: 'Köln', lat: 50.938, lon: 6.96 },
  'DE:rp': { name: 'Mainz', lat: 49.993, lon: 8.247 },
  'DE:sl': { name: 'Saarbrücken', lat: 49.24, lon: 6.997 },
  'DE:sn': { name: 'Dresden', lat: 51.051, lon: 13.738 },
  'DE:st': { name: 'Magdeburg', lat: 52.131, lon: 11.64 },
  'DE:sh': { name: 'Kiel', lat: 54.323, lon: 10.14 },
  'DE:th': { name: 'Erfurt', lat: 50.978, lon: 11.029 },
  'CH:ch': { name: 'Bern', lat: 46.948, lon: 7.447 },
};

export function placeFor(country: Country, region: string): Place {
  return PLACES[`${country}:${region}`] ?? PLACES[country === 'DE' ? 'DE:be' : country === 'CH' ? 'CH:ch' : 'AT:wien'];
}

export function weatherLabel(code: number): string {
  if (code === 0) return 'klar';
  if (code === 1) return 'meist klar';
  if (code === 2) return 'wechselnd';
  if (code === 3) return 'bedeckt';
  if (code === 45 || code === 48) return 'Nebel';
  if (code >= 51 && code <= 57) return 'Niesel';
  if (code >= 61 && code <= 67) return 'Regen';
  if (code >= 71 && code <= 77) return 'Schnee';
  if (code >= 80 && code <= 82) return 'Schauer';
  if (code === 85 || code === 86) return 'Schneeschauer';
  if (code >= 95) return 'Gewitter';
  return 'unbeständig';
}

export function weatherKind(code: number): SkyWeather {
  if (code <= 1) return 'clear';
  if (code === 2 || code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  if (code >= 51) return 'rain';
  return 'cloud';
}

interface CacheEntry {
  at: number;
  forecast: Forecast;
}

const memory = new Map<string, CacheEntry>();
const FRESH_MS = 20 * 60 * 1000;

async function loadForecast(place: Place): Promise<Forecast> {
  const key = `${place.lat.toFixed(3)},${place.lon.toFixed(3)}`;
  const cached = memory.get(key);
  if (cached && Date.now() - cached.at < FRESH_MS) return cached.forecast;
  try {
    const raw = sessionStorage.getItem(`kw-wx-${key}`);
    if (raw) {
      const parsed = JSON.parse(raw) as CacheEntry;
      if (Date.now() - parsed.at < FRESH_MS) {
        memory.set(key, parsed);
        return parsed.forecast;
      }
    }
  } catch {
    /* private mode */
  }

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(place.lat));
  url.searchParams.set('longitude', String(place.lon));
  url.searchParams.set('current', 'temperature_2m,weather_code');
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max');
  url.searchParams.set('timezone', 'Europe/Vienna');
  url.searchParams.set('forecast_days', '1');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`weather ${response.status}`);
  const body = await response.json();
  const code = Number(body.current?.weather_code ?? body.daily?.weather_code?.[0] ?? 3);
  const forecast: Forecast = {
    place: place.name,
    temperature: Math.round(Number(body.current?.temperature_2m ?? body.daily?.temperature_2m_max?.[0] ?? 0)),
    code,
    label: weatherLabel(code),
    kind: weatherKind(code),
    high: Math.round(Number(body.daily?.temperature_2m_max?.[0] ?? 0)),
    low: Math.round(Number(body.daily?.temperature_2m_min?.[0] ?? 0)),
    rainChance: body.daily?.precipitation_probability_max?.[0] ?? null,
  };
  const entry = { at: Date.now(), forecast };
  memory.set(key, entry);
  try {
    sessionStorage.setItem(`kw-wx-${key}`, JSON.stringify(entry));
  } catch {
    /* quota */
  }
  return forecast;
}

export function useForecast(country: Country, region: string): { forecast: Forecast | null; failed: boolean } {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const place = placeFor(country, region);
    let alive = true;
    setFailed(false);
    loadForecast(place)
      .then((next) => {
        if (alive) setForecast(next);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [country, region]);

  return { forecast, failed };
}
