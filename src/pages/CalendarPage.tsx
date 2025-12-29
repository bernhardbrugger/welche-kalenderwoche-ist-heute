import React, { useEffect } from 'react';
import CalendarWeekDisplay from '../components/CalendarWeekDisplay';
import DateInfoCard from '../components/DateInfoCard';
import WorkingTimeCalculator from '../components/WorkingTimeCalculator';
import YearProgressCard from '../components/YearProgressCard';
import HistoricalFactCard from '../components/HistoricalFactCard';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useWeekData } from '../context/WeekDataContext';
import { formatDateShort } from '../utils/dateUtils';

const CalendarPage: React.FC = () => {
  const { weekNumber, weekStart, weekEnd } = useWeekData();

  useEffect(() => {
    const startDate = formatDateShort(weekStart);
    const endDate = formatDateShort(weekEnd);

    document.title = `Aktuelle Kalenderwoche heute: KW ${weekNumber} (${startDate} – ${endDate})`;

    const description = `Heute ist KW ${weekNumber} (${startDate} – ${endDate}). Feiertage DE/AT, Sternzeichen & Wochenmotto auf einen Blick.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);

    // Update Open Graph and Twitter card meta tags
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', `KW ${weekNumber} heute`);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
  }, [weekNumber, weekStart, weekEnd]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 md:py-12">
      <Header />
      
      <main className="mt-6 md:mt-10 space-y-6 md:space-y-8">
        <CalendarWeekDisplay />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <DateInfoCard />
          <WorkingTimeCalculator />
        </div>
        
        <YearProgressCard />
        
        <HistoricalFactCard />

        <section className="mt-12 sm:mt-16 space-y-6 sm:space-y-8 text-gray-700">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 px-4 leading-tight">
              Aktuelle Kalenderwoche berechnen - schnell & einfach
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              Suchen Sie die aktuelle KW? Unsere App zeigt Ihnen sofort die genaue Kalenderwoche nach ISO 8601. 
              Ideal für Projektplanung, Terminkoordination und alle, die mit Kalenderwochen arbeiten müssen.
            </p>
            <div className="mt-4 text-xs sm:text-sm text-gray-500 space-y-2 px-4">
              <p className="leading-relaxed">Kalenderwoche heute | KW aktuell | Welche KW ist jetzt? | KW Berechnung</p>
              <p className="leading-relaxed">Aktuelle Woche | Kalenderwochen 2025 | KW Kalender | ISO Kalenderwoche</p>
            </div>
          </div>

          <div className="prose max-w-none px-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Warum die KW App?</h3>
            <p className="text-sm sm:text-base leading-relaxed">
              Die Kalenderwoche (KW) ist ein wichtiges Werkzeug für die Zeitplanung im Geschäftsleben und Alltag. 
              Unsere App bietet Ihnen die schnellste und einfachste Möglichkeit, die aktuelle Kalenderwoche zu ermitteln.
            </p>
            
            <h4 className="text-base sm:text-lg font-semibold mt-6 mb-3">Vorteile der KW App:</h4>
            <ul className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li>Sofortige Anzeige der aktuellen Kalenderwoche</li>
              <li>ISO 8601-konform für internationale Kompatibilität</li>
              <li>Feiertage für Deutschland und Österreich</li>
              <li>Intuitive Navigation zwischen den Wochen</li>
              <li>Kostenlos</li>
            </ul>

            <h4 className="text-base sm:text-lg font-semibold mt-6 mb-3">Kalenderwochen im Geschäftsleben</h4>
            <p className="text-sm sm:text-base leading-relaxed">
              Kalenderwochen sind besonders im geschäftlichen Kontext wichtig. Sie erleichtern die Planung von:
            </p>
            <ul className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li>Projektmanagement und Meilensteine</li>
              <li>Liefertermine und Logistik</li>
              <li>Urlaubsplanung und Abwesenheiten</li>
              <li>Berichtszeiträume und Controlling</li>
            </ul>

            <h4 className="text-base sm:text-lg font-semibold mt-6 mb-3">ISO 8601 Standard</h4>
            <p className="text-sm sm:text-base leading-relaxed">
              Die KW App folgt dem internationalen ISO 8601 Standard für Kalenderwochen. Nach diesem Standard:
            </p>
            <ul className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li>Beginnt die Woche am Montag</li>
              <li>Ist die erste Kalenderwoche des Jahres die Woche mit dem ersten Donnerstag</li>
              <li>Werden Kalenderwochen durchgehend von 1 bis 52 (oder 53) nummeriert</li>
              <li>Wird eine einheitliche, internationale Zeitrechnung gewährleistet</li>
            </ul>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CalendarPage;