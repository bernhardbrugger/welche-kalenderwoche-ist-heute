import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWeekNumber, getWeekRange, formatDate, getDayName } from '../utils/dateUtils';
import { Holiday, getHolidays } from '../utils/holidayUtils';
import { getHistoricalFact } from '../utils/factsUtils';
import { getWeeklyMotto } from '../utils/mottoUtils';
import { getZodiacSign } from '../utils/zodiacUtils';

interface WeekData {
  currentDate: Date;
  selectedDate: Date;
  weekNumber: number;
  weekYear: number;
  weekStart: Date;
  weekEnd: Date;
  formattedCurrentDate: string;
  dayName: string;
  holidays: {
    DE: Holiday[];
    AT: Holiday[];
  };
  historicalFact: string;
  weeklyMotto: string;
  selectedCountry: 'DE' | 'AT';
  setSelectedDate: (date: Date) => void;
  toggleCountry: () => void;
  navigateWeek: (direction: number) => void;
  resetToToday: () => void;
}

const WeekDataContext = createContext<WeekData | undefined>(undefined);

export const useWeekData = () => {
  const context = useContext(WeekDataContext);
  if (!context) {
    throw new Error('useWeekData must be used within a WeekDataProvider');
  }
  return context;
};

interface WeekDataProviderProps {
  children: ReactNode;
}

export const WeekDataProvider: React.FC<WeekDataProviderProps> = ({ children }) => {
  const [currentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCountry, setSelectedCountry] = useState<'DE' | 'AT'>('AT');
  
  const weekNumber = getWeekNumber(selectedDate);
  const weekYear = selectedDate.getFullYear();
  const { start: weekStart, end: weekEnd } = getWeekRange(selectedDate);
  const formattedCurrentDate = formatDate(selectedDate);
  const dayName = getDayName(selectedDate);
  
  const holidays = {
    DE: getHolidays(weekStart, weekEnd, 'DE'),
    AT: getHolidays(weekStart, weekEnd, 'AT'),
  };

  const historicalFact = getHistoricalFact(weekNumber);
  const weeklyMotto = getWeeklyMotto(weekNumber);

  const toggleCountry = () => {
    setSelectedCountry(prev => (prev === 'DE' ? 'AT' : 'DE'));
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  const resetToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <WeekDataContext.Provider
      value={{
        currentDate,
        selectedDate,
        weekNumber,
        weekYear,
        weekStart,
        weekEnd,
        formattedCurrentDate,
        dayName,
        holidays,
        historicalFact,
        weeklyMotto,
        selectedCountry,
        setSelectedDate,
        toggleCountry,
        navigateWeek,
        resetToToday,
      }}
    >
      {children}
    </WeekDataContext.Provider>
  );
};