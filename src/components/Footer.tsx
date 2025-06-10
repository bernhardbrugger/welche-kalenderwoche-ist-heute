import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  {
    id: 'about',
    label: 'Über uns',
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Über die KW App</h3>
        <p className="text-gray-600">
          Die KW App ist Ihr verlässlicher Begleiter für die präzise Bestimmung der aktuellen Kalenderwoche. 
          Entwickelt nach dem ISO-8601 Standard, bietet sie nicht nur die genaue Kalenderwoche, sondern auch 
          wertvolle Zusatzinformationen wie Feiertage, Sternzeichen und historische Ereignisse.
        </p>
        <div className="space-y-2">
          <h4 className="font-medium">Unsere Funktionen:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Präzise Kalenderwochen-Berechnung nach ISO 8601</li>
            <li>Feiertagsübersicht für Deutschland und Österreich</li>
            <li>Aktuelle Sternzeichen-Informationen</li>
            <li>Historische Ereignisse und Fakten</li>
            <li>Intuitive Navigation zwischen den Wochen</li>
            <li>Responsives Design für alle Geräte</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'features',
    label: 'Funktionen',
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Alle Funktionen im Überblick</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Kalenderwochen</h4>
            <p className="text-gray-600">
              Präzise Berechnung der Kalenderwochen nach ISO-8601 Standard. 
              Einfache Navigation zwischen den Wochen und Jahren.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Feiertage</h4>
            <p className="text-gray-600">
              Aktuelle Feiertage für Deutschland und Österreich mit genauen Terminen 
              und Informationen zur regionalen Gültigkeit.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Sternzeichen</h4>
            <p className="text-gray-600">
              Tagesaktuelle Sternzeichen-Informationen mit traditionellen Symbolen 
              und detaillierten Beschreibungen.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Historie</h4>
            <p className="text-gray-600">
              Spannende historische Ereignisse und Fakten zu jedem Tag des Jahres, 
              sorgfältig recherchiert und aufbereitet.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'privacy',
    label: 'Datenschutz',
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Datenschutzerklärung</h3>
        <p className="text-gray-600">
          Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. 
          Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen.
        </p>
        <div className="space-y-2">
          <h4 className="font-medium">Datenerhebung</h4>
          <p className="text-gray-600">
            Diese Website verwendet keine Cookies und speichert keine personenbezogenen Daten. 
            Alle Berechnungen erfolgen lokal in Ihrem Browser.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Hosting & Logs</h4>
          <p className="text-gray-600">
            Beim Besuch dieser Website werden automatisch technische Zugriffsdaten in Server-Logfiles gespeichert:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>IP-Adresse</li>
            <li>Browsertyp und -version</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Uhrzeit der Serveranfrage</li>
          </ul>
        </div>
      </div>
    )
  }
];

const Footer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <motion.footer 
      className="mt-12 pt-6 border-t border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary text-white' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 bg-gray-50 rounded-lg p-6"
        >
          {tabs.find(tab => tab.id === activeTab)?.content}
        </motion.div>
      )}
      
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-1 mb-2">
          <span>Erstellt mit</span>
          <Heart className="w-4 h-4 text-red-500" />
          <span>in Österreich</span>
        </div>
        <p>© {new Date().getFullYear()} KW App | Alle Angaben ohne Gewähr</p>
      </div>
    </motion.footer>
  );
};

export default Footer;