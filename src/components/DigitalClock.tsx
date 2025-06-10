import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      className="flex items-center justify-center gap-2 sm:gap-3 bg-gray-50 rounded-apple px-3 sm:px-4 py-2 sm:py-3 shadow-sm max-w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
      <div className="text-center min-w-0">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-mono">
          {formatTime(time)}
        </div>
        <div className="text-xs sm:text-sm text-gray-600 leading-tight">
          {formatDate(time)}
        </div>
      </div>
    </motion.div>
  );
};

export default DigitalClock;