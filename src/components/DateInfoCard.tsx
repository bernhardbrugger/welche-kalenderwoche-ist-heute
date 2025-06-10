import React from 'react';
import { CalendarDays, Sun, Moon, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';
import { formatDateShort, formatWeekRange } from '../utils/dateUtils';
import { getZodiacSign } from '../utils/zodiacUtils';
import { calculateSunTimes } from '../utils/sunTimesUtils';

const DateInfoCard: React.FC = () => {
  const { weekStart, weekEnd, holidays, selectedCountry, toggleCountry, selectedDate } = useWeekData();
  
  const countryHolidays = holidays[selectedCountry];
  const hasHolidays = countryHolidays.length > 0;
  const zodiacSign = getZodiacSign(selectedDate);

  const sunTimes = calculateSunTimes(selectedDate);

  // Berechne Tage bis zum nächsten Wochenende basierend auf dem ausgewählten Datum
  const daysUntilWeekend = () => {
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0) return 6; // Sonntag
    if (dayOfWeek === 6) return 0; // Samstag
    return 6 - dayOfWeek; // Montag bis Freitag
  };

  const weekendCountdown = daysUntilWeekend();

  // Berechne Quartal basierend auf dem ausgewählten Datum
  const currentQuarter = Math.floor(selectedDate.getMonth() / 3) + 1;

  return (
    <motion.div 
      className="card h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-primary flex-shrink-0" />
        <h2 className="text-base sm:text-lg font-semibold truncate">Wocheninformationen</h2>
      </div>
      
      <div className="space-y-4 flex-grow">
        {/* Wochenzeitraum */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Wochenzeitraum</h3>
          <p className="text-sm sm:text-lg font-medium leading-tight">
            {formatWeekRange(weekStart, weekEnd)}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
            <span className="flex-shrink-0">{currentQuarter}. Quartal {selectedDate.getFullYear()}</span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {weekendCountdown === 0 ? 'Wochenende!' : `${weekendCountdown} Tage bis Wochenende`}
              </span>
            </span>
          </div>
        </div>

        {/* Sonnenzeiten */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex-1 min-w-0">
              Sonnenzeiten (Mitteleuropa)
            </h3>
            <div className="group relative flex-shrink-0">
              <AlertCircle className="w-3 h-3 text-gray-400 cursor-help" />
              <div className="absolute bottom-full right-0 transform mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 max-w-xs">
                Berechnet für {selectedDate.toLocaleDateString('de-DE')}, Genauigkeit: {sunTimes.accuracy}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center p-2 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-orange-700">{sunTimes.sunrise}</p>
              <p className="text-xs text-orange-600 leading-tight">Aufgang</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Moon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-blue-700">{sunTimes.sunset}</p>
              <p className="text-xs text-blue-600 leading-tight">Untergang</p>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-yellow-700">{sunTimes.dayLength}</p>
              <p className="text-xs text-yellow-600 leading-tight">Tageslänge</p>
            </div>
          </div>
        </div>

        {/* Feiertage */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-center mb-2 gap-2">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex-1 min-w-0">
              Feiertage in dieser Woche
            </h3>
            <button 
              onClick={toggleCountry}
              className="text-xs font-medium text-primary hover:text-primary-600 transition-colors flex-shrink-0"
            >
              {selectedCountry === 'DE' ? '🇩🇪 DE' : '🇦🇹 AT'} ↔
            </button>
          </div>
          
          {hasHolidays ? (
            <ul className="space-y-2">
              {countryHolidays.map((holiday, index) => (
                <motion.li 
                  key={index}
                  className="flex justify-between items-center rounded-lg bg-gray-50 p-2 sm:p-3 gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="font-medium text-xs sm:text-sm flex-1 min-w-0 truncate">{holiday.name}</span>
                  <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                    {formatDateShort(holiday.date)}
                  </span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 italic leading-relaxed">
              Keine Feiertage in dieser Woche in {selectedCountry === 'DE' ? 'Deutschland' : 'Österreich'}
            </p>
          )}
        </div>

        {/* Sternzeichen */}
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Sternzeichen</h3>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl flex-shrink-0">{zodiacSign.symbol}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-lg font-medium truncate">{zodiacSign.name}</p>
              <p className="text-xs sm:text-sm text-gray-500 leading-tight">{zodiacSign.dateRange}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DateInfoCard;