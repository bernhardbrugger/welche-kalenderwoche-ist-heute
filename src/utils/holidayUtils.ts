// This is a simplified implementation. In a production app, you'd want to use an API
// or a more comprehensive dataset for holidays across multiple years.

export interface Holiday {
  date: Date;
  name: string;
  nationwide: boolean;
  type: 'public' | 'observance' | 'school';
}

// Some common German holidays for 2025
const germanHolidays2025: Holiday[] = [
  { date: new Date(2025, 0, 1), name: 'Neujahr', nationwide: true, type: 'public' },
  { date: new Date(2025, 0, 6), name: 'Heilige Drei Könige', nationwide: false, type: 'public' },
  { date: new Date(2025, 3, 18), name: 'Karfreitag', nationwide: true, type: 'public' },
  { date: new Date(2025, 3, 21), name: 'Ostermontag', nationwide: true, type: 'public' },
  { date: new Date(2025, 4, 1), name: 'Tag der Arbeit', nationwide: true, type: 'public' },
  { date: new Date(2025, 4, 29), name: 'Christi Himmelfahrt', nationwide: true, type: 'public' },
  { date: new Date(2025, 5, 9), name: 'Pfingstmontag', nationwide: true, type: 'public' },
  { date: new Date(2025, 5, 19), name: 'Fronleichnam', nationwide: false, type: 'public' },
  { date: new Date(2025, 7, 15), name: 'Mariä Himmelfahrt', nationwide: false, type: 'public' },
  { date: new Date(2025, 9, 3), name: 'Tag der Deutschen Einheit', nationwide: true, type: 'public' },
  { date: new Date(2025, 9, 31), name: 'Reformationstag', nationwide: false, type: 'public' },
  { date: new Date(2025, 10, 1), name: 'Allerheiligen', nationwide: false, type: 'public' },
  { date: new Date(2025, 11, 25), name: 'Weihnachtstag', nationwide: true, type: 'public' },
  { date: new Date(2025, 11, 26), name: 'Zweiter Weihnachtstag', nationwide: true, type: 'public' },
];

// Some common Austrian holidays for 2025
const austrianHolidays2025: Holiday[] = [
  { date: new Date(2025, 0, 1), name: 'Neujahr', nationwide: true, type: 'public' },
  { date: new Date(2025, 0, 6), name: 'Heilige Drei Könige', nationwide: true, type: 'public' },
  { date: new Date(2025, 3, 18), name: 'Karfreitag', nationwide: true, type: 'public' },
  { date: new Date(2025, 3, 21), name: 'Ostermontag', nationwide: true, type: 'public' },
  { date: new Date(2025, 4, 1), name: 'Staatsfeiertag', nationwide: true, type: 'public' },
  { date: new Date(2025, 4, 29), name: 'Christi Himmelfahrt', nationwide: true, type: 'public' },
  { date: new Date(2025, 5, 9), name: 'Pfingstmontag', nationwide: true, type: 'public' },
  { date: new Date(2025, 5, 19), name: 'Fronleichnam', nationwide: true, type: 'public' },
  { date: new Date(2025, 7, 15), name: 'Mariä Himmelfahrt', nationwide: true, type: 'public' },
  { date: new Date(2025, 9, 26), name: 'Nationalfeiertag', nationwide: true, type: 'public' },
  { date: new Date(2025, 10, 1), name: 'Allerheiligen', nationwide: true, type: 'public' },
  { date: new Date(2025, 11, 8), name: 'Mariä Empfängnis', nationwide: true, type: 'public' },
  { date: new Date(2025, 11, 25), name: 'Weihnachtstag', nationwide: true, type: 'public' },
  { date: new Date(2025, 11, 26), name: 'Stefanitag', nationwide: true, type: 'public' },
];

export const getHolidays = (weekStart: Date, weekEnd: Date, country: 'DE' | 'AT'): Holiday[] => {
  const holidays = country === 'DE' ? germanHolidays2025 : austrianHolidays2025;
  
  return holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= weekStart && holidayDate <= weekEnd;
  });
};

export const hasBridgeDay = (weekStart: Date, weekEnd: Date, country: 'DE' | 'AT'): boolean => {
  // This is a simplified implementation that would need more logic in a real app
  // to properly identify bridge days based on holidays and weekend patterns
  return false;
};

export const hasLongWeekend = (weekStart: Date, weekEnd: Date, country: 'DE' | 'AT'): boolean => {
  // This would check if there are holidays adjacent to weekends
  return false;
};