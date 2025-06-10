import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';

interface DatePickerProps {
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onClose }) => {
  const { currentDate, setSelectedDate: setContextSelectedDate } = useWeekData();
  const [localSelectedDate, setLocalSelectedDate] = useState<Date>(currentDate);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContextSelectedDate(localSelectedDate);
    onClose();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        setLocalSelectedDate(parsedDate);
      }
    } else {
      setLocalSelectedDate(currentDate);
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-apple p-6 max-w-md w-full shadow-apple-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Datum wählen</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Schließen"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700">
                Wählen Sie ein Datum, um die Kalenderwoche zu sehen
              </label>
              <input
                id="date-picker"
                type="date"
                value={localSelectedDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
                className="w-full p-2 border border-gray-300 rounded-apple bg-white focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Anwenden
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DatePicker;