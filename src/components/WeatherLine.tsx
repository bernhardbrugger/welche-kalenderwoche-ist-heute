import type { FC } from 'react';
import { useWeekData } from '../context/WeekDataContext';
import { SKY_LABEL, phaseOf, seasonOf, type Phase } from '../sky/atmosphere';
import { calculateSunTimes } from '../utils/sunTimesUtils';
import { useForecast } from '../utils/weather';

function minutes(value: string): number {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

const WeatherLine: FC = () => {
  const { now, today, country, region } = useWeekData();
  const { forecast, failed } = useForecast(country, region);
  const sun = calculateSunTimes(today);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Vienna',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0');
  let hour = read('hour');
  if (hour === 24) hour = 0;
  const phase: Phase = phaseOf(hour * 60 + read('minute'), minutes(sun.sunrise), minutes(sun.sunset));
  const when = SKY_LABEL[seasonOf(today.getMonth() + 1)][phase];

  return (
    <p className="text-right text-sm leading-tight text-muted">
      <span className="block tabular-nums text-ink">
        {String(hour).padStart(2, '0')}:{String(read('minute')).padStart(2, '0')} Uhr · Wien
      </span>
      <span className="mt-1 block">
        {when}
        {forecast ? ` · ${forecast.place} ${forecast.temperature}° ${forecast.label}` : failed ? ' · Wetterstation still' : ''}
      </span>
      {forecast && (
        <span className="mt-0.5 block text-xs">
          {forecast.low}° bis {forecast.high}°
          {forecast.rainChance != null ? ` · Regen ${forecast.rainChance} %` : ''}
        </span>
      )}
    </p>
  );
};

export default WeatherLine;
