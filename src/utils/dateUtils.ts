import { getISOWeek, getISOWeekYear, startOfISOWeek, endOfISOWeek, format, differenceInWeeks } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Get the ISO week number for a given date
 */
export const getWeekNumber = (date: Date): number => {
  return getISOWeek(date);
};

/**
 * Get the year for ISO week dating (may differ from calendar year at year boundaries)
 */
export const getWeekYear = (date: Date): number => {
  return getISOWeekYear(date);
};

/**
 * Get the start and end dates of a week containing the given date
 */
export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = startOfISOWeek(date);
  const end = endOfISOWeek(date);
  return { start, end };
};

/**
 * Format a date as "DD. MMMM YYYY" in German
 */
export const formatDate = (date: Date): string => {
  return format(date, 'd. MMMM yyyy', { locale: de });
};

/**
 * Format a date as "DD.MM.YYYY"
 */
export const formatDateShort = (date: Date): string => {
  return format(date, 'dd.MM.yyyy');
};

/**
 * Get the name of the day for a given date in German
 */
export const getDayName = (date: Date): string => {
  return format(date, 'EEEE', { locale: de });
};

/**
 * Get a formatted range string for the week
 */
export const formatWeekRange = (start: Date, end: Date): string => {
  return `${format(start, 'd.', { locale: de })} - ${format(end, 'd. MMMM yyyy', { locale: de })}`;
};

/**
 * Get a description of the relative week position
 */
export const getWeekDescription = (selectedDate: Date, currentDate: Date): string => {
  const weeksDiff = differenceInWeeks(selectedDate, currentDate);
  
  if (weeksDiff === 0) {
    return 'Aktuelle Kalenderwoche';
  }
  
  if (Math.abs(weeksDiff) <= 4) {
    if (weeksDiff < 0) {
      return `Kalenderwoche vor ${Math.abs(weeksDiff)} ${Math.abs(weeksDiff) === 1 ? 'Woche' : 'Wochen'}`;
    } else {
      return `Kalenderwoche in ${weeksDiff} ${weeksDiff === 1 ? 'Woche' : 'Wochen'}`;
    }
  }
  
  const monthDiff = Math.floor(Math.abs(weeksDiff) / 4);
  if (weeksDiff < 0) {
    return `Kalenderwoche vor ${monthDiff} ${monthDiff === 1 ? 'Monat' : 'Monaten'}`;
  } else {
    return `Kalenderwoche in ${monthDiff} ${monthDiff === 1 ? 'Monat' : 'Monaten'}`;
  }
};