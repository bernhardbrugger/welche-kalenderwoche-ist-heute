import React from 'react';
import { Info, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';

const WeekInfoCard: React.FC = () => {
  const { weeklyMotto } = useWeekData();
  
  return (
    <motion.div 
      className="card h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Wochenmotto</h2>
      </div>
      
      <div className="flex-grow flex flex-col">
        <motion.div 
          className="bg-gray-50 rounded-lg p-4 mt-2 flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-3">
            <Quote className="w-8 h-8 text-primary-300 flex-shrink-0" />
            <p className="text-lg italic font-medium leading-relaxed text-gray-700">
              {weeklyMotto}
            </p>
          </div>
        </motion.div>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-500">
            <strong>Tipp:</strong> Ein neues Wochenmotto wird jede Woche generiert. Nutzen Sie es als Inspiration für die kommenden Tage.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeekInfoCard;