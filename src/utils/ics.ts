import type { WeekInfo } from '../../netlify/edge-functions/lib/week.ts';
import type { Holiday } from './holidayUtils';

function stamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function exclusiveEnd(date: Date): string {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12, 0, 0, 0);
  return stamp(next);
}

function event(uid: string, start: Date, endExclusiveStamp: string, summary: string, description: string): string {
  return [
    'BEGIN:VEVENT',
    `UID:${uid}@welche-kalenderwoche-ist-heute.at`,
    `DTSTAMP:${stamp(new Date())}T000000Z`,
    `DTSTART;VALUE=DATE:${stamp(start)}`,
    `DTEND;VALUE=DATE:${endExclusiveStamp}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    '',
  ].join('\r\n');
}

export function buildWeekIcs(info: WeekInfo, weekStart: Date, weekEnd: Date, holidays: Holiday[]): string {
  const events = [
    event(
      `kw-${info.iso}`,
      weekStart,
      exclusiveEnd(weekEnd),
      `KW ${info.week} ${info.weekYear}`,
      info.range,
    ),
    ...holidays.map((holiday) =>
      event(
        `holiday-${stamp(holiday.date)}-${holiday.name.replace(/\s+/g, '-')}`,
        holiday.date,
        exclusiveEnd(holiday.date),
        holiday.name,
        'Gesetzlicher Feiertag',
      ),
    ),
  ];
  return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//welche-kalenderwoche-ist-heute.at//KW//DE\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n${events.join('')}\r\nEND:VCALENDAR\r\n`;
}

export function downloadIcs(filename: string, contents: string) {
  const blob = new Blob([contents], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
