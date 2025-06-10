import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import DigitalClock from './DigitalClock';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="text-center space-y-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-4 sm:mb-6">
        <DigitalClock />
      </div>
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight px-4">
        Welche Kalenderwoche ist heute?
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
        Die schnellste und einfachste Möglichkeit, die aktuelle Kalenderwoche zu ermitteln.
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 px-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          ISO-8601 Standard
        </span>
        <span className="hidden sm:inline">•</span>
        <span>Kostenlos</span>
        <span className="hidden sm:inline">•</span>
        <span>Werbefrei</span>
      </div>
    </motion.header>
  );
};

export default Header;