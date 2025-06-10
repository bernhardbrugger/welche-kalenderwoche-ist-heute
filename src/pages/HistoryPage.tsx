import React from 'react';
import { motion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';
import { History, Calendar } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const { historicalFact, selectedDate } = useWeekData();
  const formattedDate = selectedDate.toLocaleDateString('de-DE', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Historische Ereignisse
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie bedeutende historische Ereignisse und wie sie unsere Welt geprägt haben. 
            Jeden Tag präsentieren wir Ihnen faszinierende Einblicke in die Geschichte.
          </p>
        </header>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Heute in der Geschichte: {formattedDate}</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex gap-4">
              <History className="w-8 h-8 text-primary flex-shrink-0" />
              <p className="text-lg text-gray-700 leading-relaxed">
                {historicalFact}
              </p>
            </div>
          </div>
        </div>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6">Warum Geschichte wichtig ist</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Die Geschichte lehrt uns wichtige Lektionen über die Entwicklung der Menschheit. 
              Sie hilft uns, aktuelle Ereignisse besser zu verstehen und aus der Vergangenheit zu lernen.
            </p>
            <p>
              Jeden Tag präsentieren wir Ihnen sorgfältig recherchierte historische Ereignisse, 
              die an diesem Tag stattgefunden haben. Diese Fakten geben Einblicke in verschiedene 
              Bereiche wie Politik, Wissenschaft, Kultur und Gesellschaft.
            </p>
            <p>
              Unsere historischen Fakten werden regelmäßig aktualisiert und erweitert, 
              um Ihnen täglich neue, interessante Einblicke in die Vergangenheit zu bieten.
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default HistoryPage;