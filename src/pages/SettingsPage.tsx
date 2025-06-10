import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Sun, Moon } from 'lucide-react';
import { useWeekData } from '../context/WeekDataContext';
import { useTheme } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
  const { selectedCountry, toggleCountry } = useWeekData();
  const { isDark, toggleTheme } = useTheme();

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
            Einstellungen
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Passen Sie die KW App an Ihre Bedürfnisse an. Hier können Sie verschiedene 
            Einstellungen vornehmen, um Ihr Nutzererlebnis zu optimieren.
          </p>
        </header>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Allgemeine Einstellungen</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-medium">Land für Feiertage</h3>
                  <p className="text-sm text-gray-600">
                    Wählen Sie das Land für die Anzeige der Feiertage
                  </p>
                </div>
              </div>
              <button
                onClick={toggleCountry}
                className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                {selectedCountry === 'DE' ? '🇩🇪 Deutschland' : '🇦🇹 Österreich'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <div>
                  <h3 className="font-medium">Erscheinungsbild</h3>
                  <p className="text-sm text-gray-600">
                    Wählen Sie zwischen hellem und dunklem Design
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                {isDark ? 'Hell' : 'Dunkel'}
              </button>
            </div>
          </div>
        </div>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-4">Über die App</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Version: 1.0.0
            </p>
            <p>
              Die KW App ist ein kostenloses Tool zur Bestimmung der Kalenderwoche. 
              Sie wurde entwickelt, um Ihnen schnell und übersichtlich die aktuelle 
              Kalenderwoche sowie wichtige Zusatzinformationen anzuzeigen.
            </p>
            <p>
              Alle Berechnungen erfolgen lokal in Ihrem Browser. Die App speichert 
              keine persönlichen Daten und kommt ohne Cookies aus.
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default SettingsPage;