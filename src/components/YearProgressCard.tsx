import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';
import { getWeekNumber } from '../utils/dateUtils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const YearProgressCard: React.FC = () => {
  const { selectedDate } = useWeekData();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [quarterTimeLeft, setQuarterTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [halfYearTimeLeft, setHalfYearTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [monthTimeLeft, setMonthTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const hasAnimated = useRef(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const referenceDate = selectedDate;
      const referenceYear = referenceDate.getFullYear();
      
      // Jahresende
      const endOfYear = new Date(referenceYear, 11, 31, 23, 59, 59);
      const yearDifference = endOfYear.getTime() - referenceDate.getTime();
      
      // Quartalsende
      const currentQuarter = Math.floor(referenceDate.getMonth() / 3);
      const endOfQuarter = new Date(referenceYear, (currentQuarter + 1) * 3, 0, 23, 59, 59);
      const quarterDifference = endOfQuarter.getTime() - referenceDate.getTime();
      
      // Halbjahresende
      const endOfHalfYear = referenceDate.getMonth() < 6 
        ? new Date(referenceYear, 5, 30, 23, 59, 59)
        : new Date(referenceYear, 11, 31, 23, 59, 59);
      const halfYearDifference = endOfHalfYear.getTime() - referenceDate.getTime();
      
      // Monatsende
      const endOfMonth = new Date(referenceYear, referenceDate.getMonth() + 1, 0, 23, 59, 59);
      const monthDifference = endOfMonth.getTime() - referenceDate.getTime();

      // Jahresende
      setTimeLeft({
        days: Math.max(0, Math.floor(yearDifference / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((yearDifference / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((yearDifference / 1000 / 60) % 60)),
        seconds: Math.max(0, Math.floor((yearDifference / 1000) % 60))
      });

      // Quartalsende
      setQuarterTimeLeft({
        days: Math.max(0, Math.floor(quarterDifference / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((quarterDifference / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((quarterDifference / 1000 / 60) % 60)),
        seconds: Math.max(0, Math.floor((quarterDifference / 1000) % 60))
      });

      // Halbjahresende
      setHalfYearTimeLeft({
        days: Math.max(0, Math.floor(halfYearDifference / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((halfYearDifference / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((halfYearDifference / 1000 / 60) % 60)),
        seconds: Math.max(0, Math.floor((halfYearDifference / 1000) % 60))
      });

      // Monatsende
      setMonthTimeLeft({
        days: Math.max(0, Math.floor(monthDifference / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((monthDifference / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((monthDifference / 1000 / 60) % 60)),
        seconds: Math.max(0, Math.floor((monthDifference / 1000) % 60))
      });
    };

    // Berechne sofort beim Laden
    calculateTimeLeft();

    // Nur Live-Updates wenn das ausgewählte Datum heute ist
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    let timer: NodeJS.Timeout | null = null;
    
    if (isToday) {
      timer = setInterval(calculateTimeLeft, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [selectedDate]);

  const weekNumber = getWeekNumber(selectedDate);
  const yearProgress = Math.floor((weekNumber / 52) * 100);
  
  // Quartalsfortschritt
  const currentQuarter = Math.floor(selectedDate.getMonth() / 3);
  const quarterStartMonth = currentQuarter * 3;
  const quarterStart = new Date(selectedDate.getFullYear(), quarterStartMonth, 1);
  const quarterEnd = new Date(selectedDate.getFullYear(), quarterStartMonth + 3, 0);
  const quarterProgress = Math.floor(((selectedDate.getTime() - quarterStart.getTime()) / (quarterEnd.getTime() - quarterStart.getTime())) * 100);

  // Halbjahresfortschritt
  const halfYearStart = selectedDate.getMonth() < 6 
    ? new Date(selectedDate.getFullYear(), 0, 1)
    : new Date(selectedDate.getFullYear(), 6, 1);
  const halfYearEnd = selectedDate.getMonth() < 6 
    ? new Date(selectedDate.getFullYear(), 5, 30)
    : new Date(selectedDate.getFullYear(), 11, 31);
  const halfYearProgress = Math.floor(((selectedDate.getTime() - halfYearStart.getTime()) / (halfYearEnd.getTime() - halfYearStart.getTime())) * 100);

  // Monatsfortschritt
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const monthProgress = Math.floor(((selectedDate.getTime() - monthStart.getTime()) / (monthEnd.getTime() - monthStart.getTime())) * 100);

  const ProgressSection = ({ title, progress, timeLeft, description, isPast }: {
    title: string;
    progress: number;
    timeLeft: TimeLeft;
    description: string;
    isPast?: boolean;
  }) => (
    <div className={`space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-lg ${isPast ? 'bg-gray-100' : 'bg-gray-50'}`}>
      <h3 className={`text-sm sm:text-base font-semibold truncate ${isPast ? 'text-gray-600' : 'text-gray-800'}`}>
        {title}
      </h3>
      
      <div>
        <div className="flex justify-between items-center mb-2 gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 flex-1 min-w-0">
            Fortschritt {Math.min(100, Math.max(0, progress))}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            className={`h-full rounded-full transition-all duration-300 ${isPast ? 'bg-gray-400' : 'bg-primary'}`}
          />
        </div>
      </div>

      {!isPast && (
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          <div className="text-center p-1 sm:p-2 bg-white rounded">
            <p className="text-sm sm:text-lg font-bold text-primary">{timeLeft.days}</p>
            <p className="text-xs text-gray-600 leading-tight">Tage</p>
          </div>
          <div className="text-center p-1 sm:p-2 bg-white rounded">
            <p className="text-sm sm:text-lg font-bold text-primary">{timeLeft.hours}</p>
            <p className="text-xs text-gray-600 leading-tight">Std</p>
          </div>
          <div className="text-center p-1 sm:p-2 bg-white rounded">
            <p className="text-sm sm:text-lg font-bold text-primary">{timeLeft.minutes}</p>
            <p className="text-xs text-gray-600 leading-tight">Min</p>
          </div>
          <div className="text-center p-1 sm:p-2 bg-white rounded">
            <p className="text-sm sm:text-lg font-bold text-primary">{timeLeft.seconds}</p>
            <p className="text-xs text-gray-600 leading-tight">Sek</p>
          </div>
        </div>
      )}

      <div className={`text-xs sm:text-sm text-center leading-relaxed ${isPast ? 'text-gray-500' : 'text-gray-500'}`}>
        {isPast ? 'Zeitraum bereits vergangen' : description}
      </div>
    </div>
  );

  // Prüfe ob Zeiträume bereits vergangen sind
  const now = selectedDate;
  const isMonthPast = monthTimeLeft.days === 0 && monthTimeLeft.hours === 0 && monthTimeLeft.minutes === 0 && monthTimeLeft.seconds === 0;
  const isQuarterPast = quarterTimeLeft.days === 0 && quarterTimeLeft.hours === 0 && quarterTimeLeft.minutes === 0 && quarterTimeLeft.seconds === 0;
  const isHalfYearPast = halfYearTimeLeft.days === 0 && halfYearTimeLeft.hours === 0 && halfYearTimeLeft.minutes === 0 && halfYearTimeLeft.seconds === 0;
  const isYearPast = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <motion.section
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Timer className="w-5 h-5 text-primary flex-shrink-0" />
        <h2 className="text-base sm:text-lg font-semibold truncate">
          Zeitfortschritt {selectedDate.getFullYear()}
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <ProgressSection
          title={`${selectedDate.toLocaleDateString('de-DE', { month: 'long' })}`}
          progress={monthProgress}
          timeLeft={monthTimeLeft}
          description={`Bis zum Monatsende ${monthTimeLeft.days} Tage und ${monthTimeLeft.hours} Stunden`}
          isPast={isMonthPast}
        />

        <ProgressSection
          title={`${currentQuarter + 1}. Quartal`}
          progress={quarterProgress}
          timeLeft={quarterTimeLeft}
          description={`Bis zum Quartalsende ${quarterTimeLeft.days} Tage und ${quarterTimeLeft.hours} Stunden`}
          isPast={isQuarterPast}
        />

        <ProgressSection
          title={selectedDate.getMonth() < 6 ? "1. Halbjahr" : "2. Halbjahr"}
          progress={halfYearProgress}
          timeLeft={halfYearTimeLeft}
          description={`Bis zum Halbjahresende ${halfYearTimeLeft.days} Tage und ${halfYearTimeLeft.hours} Stunden`}
          isPast={isHalfYearPast}
        />

        <ProgressSection
          title="Jahresfortschritt"
          progress={yearProgress}
          timeLeft={timeLeft}
          description={`Bis zum Jahresende ${timeLeft.days} Tage und ${timeLeft.hours} Stunden`}
          isPast={isYearPast}
        />
      </div>
    </motion.section>
  );
};

export default YearProgressCard;