import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Globe, Star } from 'lucide-react';

const InfoPage: React.FC = () => {
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
            Über die KW App
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Die KW App ist Ihr verlässlicher Begleiter für die präzise Bestimmung der Kalenderwoche. 
            Entwickelt nach dem ISO-8601 Standard, bietet sie nicht nur die genaue Kalenderwoche, 
            sondern auch wertvolle Zusatzinformationen.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">ISO-8601 Standard</h2>
            </div>
            <p className="text-gray-600">
              Unsere Kalenderwochen-Berechnung folgt dem internationalen ISO-8601 Standard. 
              Dies garantiert eine präzise und weltweit einheitliche Zeitrechnung. Die erste 
              Kalenderwoche eines Jahres ist dabei die Woche, die den ersten Donnerstag enthält.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Aktuelle Zeitrechnung</h2>
            </div>
            <p className="text-gray-600">
              Die App aktualisiert sich automatisch und zeigt immer die korrekte Kalenderwoche an. 
              Sie können auch beliebig durch vergangene und zukünftige Wochen navigieren, um 
              Planungen und Rückblicke zu ermöglichen.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Feiertage & Events</h2>
            </div>
            <p className="text-gray-600">
              Für Deutschland und Österreich zeigen wir alle wichtigen Feiertage an. 
              Sie können zwischen beiden Ländern wechseln und sehen sofort, welche 
              Feiertage in der ausgewählten Woche anstehen.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Zusatzfunktionen</h2>
            </div>
            <p className="text-gray-600">
              Neben der Kalenderwoche bieten wir interessante Zusatzinformationen wie 
              aktuelle Sternzeichen, historische Ereignisse und inspirierende Wochenmottos. 
              So wird jeder Besuch der App zu einem informativen Erlebnis.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6">Geschichte der Kalenderwoche</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Die Verwendung von Kalenderwochen hat eine lange Geschichte in der menschlichen 
              Zeitrechnung. Der moderne Standard ISO 8601 wurde 1988 eingeführt und definiert 
              die einheitliche Berechnung von Kalenderwochen.
            </p>
            <p>
              Nach ISO 8601 beginnt eine Woche am Montag und endet am Sonntag. Die erste 
              Kalenderwoche eines Jahres ist die Woche, die den ersten Donnerstag enthält. 
              Dieses System gewährleistet eine eindeutige und konsistente Wochennummerierung.
            </p>
            <p>
              In der geschäftlichen Kommunikation haben sich Kalenderwochen als effizientes 
              Werkzeug zur Terminplanung und Projektkoordination etabliert. Sie ermöglichen 
              eine präzise und sprachunabhängige Zeitangabe.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-4">Häufig gestellte Fragen</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Wie wird die Kalenderwoche berechnet?</h3>
              <p className="text-gray-600">
                Die Berechnung erfolgt nach ISO-8601. Die erste Kalenderwoche eines Jahres 
                ist die Woche, die den ersten Donnerstag enthält. Jede Woche beginnt am 
                Montag und endet am Sonntag.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Sind die Feiertage immer aktuell?</h3>
              <p className="text-gray-600">
                Ja, unsere Feiertags-Datenbank wird regelmäßig aktualisiert und enthält 
                alle offiziellen Feiertage für Deutschland und Österreich.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Kann ich die App auch offline nutzen?</h3>
              <p className="text-gray-600">
                Die KW App funktioniert auch offline, da alle Berechnungen lokal in Ihrem 
                Browser durchgeführt werden. Nur für Updates der Feiertage wird eine 
                Internetverbindung benötigt.
              </p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default InfoPage;