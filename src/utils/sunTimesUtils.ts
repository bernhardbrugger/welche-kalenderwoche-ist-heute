/**
 * Sonnenauf- und -untergang für Wien (48.21°N, 16.37°E).
 * Almanach-Formel (US Naval Observatory), lokale Uhrzeit über Europe/Vienna,
 * damit die Sommerzeitumstellung am richtigen Zeitpunkt greift.
 * Abweichung typisch unter zwei Minuten, ohne Berge und Refraktionswetter.
 */

export interface SunTimes {
  sunrise: string;
  sunset: string;
  dayLength: string;
  accuracy: string;
}

const LAT = 48.2082;
const LNG = 16.3738;
const ZENITH = 90.833;

const normDegrees = (value: number) => {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
};

const normHours = (value: number) => {
  const wrapped = value % 24;
  return wrapped < 0 ? wrapped + 24 : wrapped;
};

/** UTC hours of sunrise (rising=true) or sunset. */
function eventUtcHours(year: number, month: number, day: number, rising: boolean): number | null {
  const n1 = Math.floor((275 * month) / 9);
  const n2 = Math.floor((month + 9) / 12);
  const n3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  const dayOfYear = n1 - n2 * n3 + day - 30;
  const lngHour = LNG / 15;
  const t = dayOfYear + ((rising ? 6 : 18) - lngHour) / 24;
  const meanAnomaly = 0.9856 * t - 3.289;
  const rad = Math.PI / 180;
  let trueLong = meanAnomaly + 1.916 * Math.sin(meanAnomaly * rad) + 0.02 * Math.sin(2 * meanAnomaly * rad) + 282.634;
  trueLong = normDegrees(trueLong);
  let rightAsc = (Math.atan(0.91764 * Math.tan(trueLong * rad)) * 180) / Math.PI;
  rightAsc = normDegrees(rightAsc);
  rightAsc += Math.floor(trueLong / 90) * 90 - Math.floor(rightAsc / 90) * 90;
  rightAsc /= 15;
  const sinDec = 0.39782 * Math.sin(trueLong * rad);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosHour =
    (Math.cos(ZENITH * rad) - sinDec * Math.sin(LAT * rad)) / (cosDec * Math.cos(LAT * rad));
  if (cosHour > 1 || cosHour < -1) return null;
  const hourAngle = (rising ? 360 - (Math.acos(cosHour) * 180) / Math.PI : (Math.acos(cosHour) * 180) / Math.PI) / 15;
  return normHours(hourAngle + rightAsc - 0.06571 * t - 6.622 - lngHour);
}

function formatVienna(year: number, month: number, day: number, utcHours: number): string {
  const instant = new Date(Date.UTC(year, month - 1, day) + utcHours * 3_600_000);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Vienna',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant);
  const hour = parts.find((part) => part.type === 'hour')?.value ?? '00';
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00';
  return `${hour === '24' ? '00' : hour}:${minute}`;
}

function formatDuration(hours: number): string {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${m}m`;
}

export const calculateSunTimes = (date: Date): SunTimes => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const rise = eventUtcHours(year, month, day, true);
  const set = eventUtcHours(year, month, day, false);
  if (rise == null || set == null) {
    return { sunrise: '—', sunset: '—', dayLength: '—', accuracy: '±2 Min' };
  }
  let length = set - rise;
  if (length < 0) length += 24;
  return {
    sunrise: formatVienna(year, month, day, rise),
    sunset: formatVienna(year, month, day, set),
    dayLength: formatDuration(length),
    accuracy: '±2 Min',
  };
};
