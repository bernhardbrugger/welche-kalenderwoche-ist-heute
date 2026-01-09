import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Info, Shield, Send, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'calendar', path: '/', label: 'Kalender', icon: Calendar },
    { id: 'info', path: '/info', label: 'Info', icon: Info },
    { id: 'contact', path: '/kontakt', label: 'Kontakt', icon: Send },
    { id: 'privacy', path: '/datenschutz', label: 'Datenschutz', icon: Shield },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center">
            <img src="/favicon.svg" alt="KW App Logo" className="h-10 w-auto" />
          </NavLink>
          
          <div className="hidden md:flex space-x-4">
            {tabs.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `
                  px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors
                  ${isActive 
                    ? 'text-primary bg-primary/5' 
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {tabs.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'text-primary bg-primary/5' 
                      : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
