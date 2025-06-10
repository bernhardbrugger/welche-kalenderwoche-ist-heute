import React from 'react';
import { History } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';

const HistoricalFactCard: React.FC = () => {
  const { historicalFact, weekNumber } = useWeekData();

  return (
    <motion.section 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-primary flex-shrink-0" />
        <h2 className="text-base sm:text-lg font-semibold">Historischer Fakt zum heutigen Tag</h2>
      </div>
      
      <motion.div 
        className="bg-gray-50 rounded-lg p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm sm:text-lg leading-relaxed text-gray-700">{historicalFact}</p>
      </motion.div>
      
      <div className="mt-4 text-xs sm:text-sm text-gray-500 text-right">
        Wussten Sie das? Jeden Tag gibt es einen neuen historischen Fakt.
      </div>
    </motion.section>
  );
};

export default HistoricalFactCard;