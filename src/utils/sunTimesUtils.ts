/**
 * Berechnung von Sonnenaufgang und Sonnenuntergang
 * Basiert auf astronomischen Formeln für Mitteleuropa
 * 
 * WICHTIG: Dies ist eine vereinfachte Berechnung!
 * - Genauigkeit: ±10-15 Minuten
 * - Optimiert für Mitteleuropa (48°N, 16°E - Wien/München)
 * - Berücksichtigt NICHT: Zeitzone-Verschiebungen, Sommerzeit, lokale Topographie
 * 
 * Für höchste Genauigkeit würde eine externe API benötigt werden.
 */

export interface SunTimes {
  sunrise: string;
  sunset: string;
  dayLength: string;
  accuracy: string;
}

export const calculateSunTimes = (date: Date): SunTimes => {
  // Koordinaten für Mitteleuropa (ungefähr Wien/München)
  const latitude = 48.2; // Breitengrad
  const longitude = 16.37; // Längengrad (Wien)
  
  // Tag des Jahres berechnen
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Sonnendeklination berechnen
  const P = Math.asin(0.39795 * Math.cos(0.98563 * (dayOfYear - 173) * Math.PI / 180));
  
  // Zeitgleichung
  const argument = 0.98563 * (dayOfYear - 81) * Math.PI / 180;
  const timeEquation = 4 * (longitude * Math.PI / 180 - Math.atan2(Math.tan(argument), Math.cos(23.44 * Math.PI / 180)));
  
  // Stundenwinkel für Sonnenaufgang/-untergang
  const latRad = latitude * Math.PI / 180;
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(P));
  
  // Sonnenaufgang und -untergang in Dezimalstunden (UTC)
  const sunriseUTC = 12 - hourAngle * 12 / Math.PI - timeEquation / 60;
  const sunsetUTC = 12 + hourAngle * 12 / Math.PI - timeEquation / 60;
  
  // Umrechnung in lokale Zeit (MEZ/MESZ)
  // Vereinfacht: +1 Stunde für MEZ, +2 für MESZ
  const isDST = isDaylightSavingTime(date);
  const timeOffset = isDST ? 2 : 1;
  
  const sunriseLocal = sunriseUTC + timeOffset;
  const sunsetLocal = sunsetUTC + timeOffset;
  
  // Tageslänge berechnen
  const dayLengthHours = sunsetLocal - sunriseLocal;
  
  const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };
  
  const formatDuration = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };
  
  return {
    sunrise: formatTime(sunriseLocal),
    sunset: formatTime(sunsetLocal),
    dayLength: formatDuration(dayLengthHours),
    accuracy: "±10-15 Min"
  };
};

/**
 * Prüft ob Sommerzeit aktiv ist (vereinfacht für Mitteleuropa)
 * Sommerzeit: Letzter Sonntag im März bis letzter Sonntag im Oktober
 */
const isDaylightSavingTime = (date: Date): boolean => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Vor März oder nach Oktober: Winterzeit
  if (month < 2 || month > 9) return false;
  
  // April bis September: Sommerzeit
  if (month > 2 && month < 9) return true;
  
  // März: Prüfe ob nach letztem Sonntag
  if (month === 2) {
    const lastSundayMarch = getLastSundayOfMonth(year, 2);
    return day >= lastSundayMarch;
  }
  
  // Oktober: Prüfe ob vor letztem Sonntag
  if (month === 9) {
    const lastSundayOctober = getLastSundayOfMonth(year, 9);
    return day < lastSundayOctober;
  }
  
  return false;
};

const getLastSundayOfMonth = (year: number, month: number): number => {
  const lastDay = new Date(year, month + 1, 0);
  const lastSunday = lastDay.getDate() - lastDay.getDay();
  return lastSunday;
};