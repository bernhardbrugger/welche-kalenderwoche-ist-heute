import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';
import DatePicker from './DatePicker';
import { getWeekDescription } from '../utils/dateUtils';

const CalendarWeekDisplay: React.FC = () => {
  const { weekNumber, weekYear, dayName, formattedCurrentDate, navigateWeek, selectedDate, currentDate, resetToToday } = useWeekData();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const prevWeek = weekNumber === 1 ? 52 : weekNumber - 1;
  const nextWeek = weekNumber === 52 ? 1 : weekNumber + 1;
  const weekDescription = getWeekDescription(selectedDate, currentDate);

  return (
    <motion.section 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex flex-col items-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="text-xs sm:text-sm font-medium text-gray-500 mb-2 text-center px-2">
          {weekDescription}
        </div>
        
        <div className="flex items-center justify-center gap-1 sm:gap-4 md:gap-8 w-full">
          <button
            onClick={() => navigateWeek(-1)}
            className="group p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Vorherige Woche"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-primary transition-colors" />
          </button>

          <div className="flex items-center gap-1 sm:gap-4 md:gap-8 min-w-0 flex-1">
            <span className="hidden lg:block text-lg xl:text-2xl text-gray-300 opacity-50 flex-shrink-0">
              KW {prevWeek}
            </span>
            
            <motion.div 
              className="text-center min-w-0 flex-1"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-huge font-bold text-primary flex items-center justify-center flex-wrap gap-1 sm:gap-2">
                <span className="whitespace-nowrap">KW</span>
                <span>{weekNumber}</span>
                <span className="text-xs sm:text-sm text-gray-500 align-top mt-1 sm:mt-2 md:mt-4">{weekYear}</span>
              </div>
            </motion.div>
            
            <span className="hidden lg:block text-lg xl:text-2xl text-gray-300 opacity-50 flex-shrink-0">
              KW {nextWeek}
            </span>
          </div>

          <button
            onClick={() => navigateWeek(1)}
            className="group p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Nächste Woche"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-primary transition-colors" />
          </button>
        </div>
        
        <div className="text-sm sm:text-base md:text-lg text-text-light mt-2 text-center px-2 leading-relaxed">
          {selectedDate.toDateString() === currentDate.toDateString() ? (
            <>
              <span className="block sm:inline">Heute ist <span className="font-medium">{dayName}</span>,</span>
              <span className="block sm:inline sm:ml-1">der <span className="font-medium">{formattedCurrentDate}</span></span>
            </>
          ) : (
            <>
              <span className="block sm:inline"><span className="font-medium">{dayName}</span>,</span>
              <span className="block sm:inline sm:ml-1">der <span className="font-medium">{formattedCurrentDate}</span></span>
            </>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6 w-full sm:w-auto">
          <motion.button 
            className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base px-3 sm:px-4 py-2"
            onClick={() => setIsDatePickerOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="w-4 h-4" />
            <span className="truncate">Anderes Datum wählen</span>
          </motion.button>

          <motion.button 
            className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base px-3 sm:px-4 py-2"
            onClick={resetToToday}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Heute</span>
          </motion.button>
        </div>
      </motion.div>

      {isDatePickerOpen && (
        <DatePicker onClose={() => setIsDatePickerOpen(false)} />
      )}
    </motion.section>
  );
};

export default CalendarWeekDisplay;