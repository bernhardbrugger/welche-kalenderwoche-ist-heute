import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';

interface WorkingTimeData {
  totalWorkingDays: number;
  remainingWorkingDays: number;
  workingDaysThisWeek: number;
  workingHoursThisWeek: number;
  remainingWorkingHours: number;
  totalWorkingHours: number;
  workedDays: number;
  workedHours: number;
}

const WorkingTimeCalculator: React.FC = () => {
  const { weekStart, weekEnd, holidays, selectedCountry, selectedDate } = useWeekData();
  const [workingTimeData, setWorkingTimeData] = useState<WorkingTimeData>({
    totalWorkingDays: 0,
    remainingWorkingDays: 0,
    workingDaysThisWeek: 0,
    workingHoursThisWeek: 0,
    remainingWorkingHours: 0,
    totalWorkingHours: 0,
    workedDays: 0,
    workedHours: 0
  });

  // hoursPerDay jetzt als String
  const [hoursPerDay, setHoursPerDay] = useState<string>('8');

  useEffect(() => {
    calculateWorkingTime();
  }, [weekStart, weekEnd, holidays, selectedCountry, hoursPerDay, selectedDate]);

  const isWorkingDay = (date: Date, year: number): boolean => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;

    const countryHolidays = holidays[selectedCountry];
    return !countryHolidays.some(holiday => {
      const holidayInYear = new Date(year, holiday.date.getMonth(), holiday.date.getDate());
      return holidayInYear.toDateString() === date.toDateString();
    });
  };

  const calculateWorkingTime = () => {
    const referenceYear = selectedDate.getFullYear();

    // parse hoursPerDay nur hier
    const numericHours = parseFloat(hoursPerDay.replace(',', '.')) || 8;

    // Arbeitstage diese Woche
    let workingDaysThisWeek = 0;
    const currentDate = new Date(weekStart);
    while (currentDate <= weekEnd) {
      if (isWorkingDay(currentDate, referenceYear)) workingDaysThisWeek++;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Arbeitstage im Jahr
    let totalWorkingDays = 0;
    let remainingWorkingDays = 0;
    let workedDays = 0;
    const yearStart = new Date(referenceYear, 0, 1);
    const yearEnd = new Date(referenceYear, 11, 31);
    const iterDate = new Date(yearStart);
    while (iterDate <= yearEnd) {
      if (isWorkingDay(iterDate, referenceYear)) {
        totalWorkingDays++;
        if (iterDate > selectedDate) remainingWorkingDays++;
        else workedDays++;
      }
      iterDate.setDate(iterDate.getDate() + 1);
    }

    setWorkingTimeData({
      totalWorkingDays,
      remainingWorkingDays,
      workingDaysThisWeek,
      workingHoursThisWeek: workingDaysThisWeek * numericHours,
      remainingWorkingHours: remainingWorkingDays * numericHours,
      totalWorkingHours: totalWorkingDays * numericHours,
      workedDays,
      workedHours: workedDays * numericHours
    });
  };

  const workingDaysProgress = workingTimeData.totalWorkingDays > 0
    ? Math.round((workingTimeData.workedDays / workingTimeData.totalWorkingDays) * 100)
    : 0;

  return (
    <motion.div
      className="card h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary flex-shrink-0" />
        <h2 className="text-base sm:text-lg font-semibold truncate">
          Arbeitszeitrechner {selectedDate.getFullYear()}
        </h2>
      </div>

      <div className="space-y-4 flex-grow">
        {/* Einstellungen */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <label htmlFor="hours-per-day" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Arbeitsstunden pro Tag
          </label>
          <input
            id="hours-per-day"
            type="text"
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]*$"
            value={hoursPerDay}
            onChange={e => setHoursPerDay(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Diese Woche */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-3">Ausgewählte Woche</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <p className="text-lg sm:text-2xl font-bold text-primary">{workingTimeData.workingDaysThisWeek}</p>
              <p className="text-xs sm:text-sm text-gray-600 leading-tight">Arbeitstage</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <p className="text-lg sm:text-2xl font-bold text-primary">{workingTimeData.workingHoursThisWeek}</p>
              <p className="text-xs sm:text-sm text-gray-600 leading-tight">Arbeitsstunden</p>
            </div>
          </div>
        </div>

        {/* Jahresübersicht */}
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-3">
            Jahresübersicht {selectedDate.getFullYear()}
          </h3>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2 gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600 flex-1 min-w-0">
                Arbeitstage-Fortschritt {workingDaysProgress}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                {workingTimeData.workedDays} von {workingTimeData.totalWorkingDays}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${workingDaysProgress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
              <p className="text-sm sm:text-xl font-bold text-primary">{workingTimeData.remainingWorkingDays}</p>
              <p className="text-xs sm:text-sm text-gray-600 leading-tight">Verbleibende Arbeitstage</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
              <p className="text-sm sm:text-xl font-bold text-primary">{workingTimeData.remainingWorkingHours}</p>
              <p className="text-xs sm:text-sm text-gray-600 leading-tight">Verbleibende Arbeitsstunden</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4">
            <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
              <p className="text-sm sm:text-xl font-bold text-blue-600">{workingTimeData.workedDays}</p>
              <p className="text-xs sm:text-sm text-blue-600 leading-tight">Bereits gearbeitete Tage</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
              <p className="text-sm sm:text-xl font-bold text-blue-600">{workingTimeData.workedHours}</p>
              <p className="text-xs sm:text-sm text-blue-600 leading-tight">Bereits gearbeitete Stunden</p>
            </div>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-500 text-center pt-2 border-t border-gray-200 leading-relaxed">
          Berechnung berücksichtigt Wochenenden und Feiertage in {selectedCountry === 'DE' ? 'Deutschland' : 'Österreich'}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkingTimeCalculator;
