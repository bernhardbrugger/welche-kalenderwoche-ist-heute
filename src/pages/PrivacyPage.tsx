import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const PrivacyPage: React.FC = () => {
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
            Datenschutzerklärung
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Wir freuen uns über Ihr Interesse an unserer Website. Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen.
          </p>
        </header>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Allgemeine Informationen</h2>
          </div>

          <div className="prose max-w-none text-gray-600 space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-900">1. Verantwortliche Stelle</h3>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
                Bernhard Brugger<br />
                E-Mail: bernhard.brugger@outlook.com
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">2. Erhebung und Verarbeitung von Daten</h3>
              <p>
                Beim Besuch unserer Website werden automatisch technische Zugriffsdaten gespeichert.
                Dies umfasst:
              </p>
              <ul className="list-disc pl-6">
                <li>IP-Adresse</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt</li>
                <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">3. Google Ads</h3>
              <p>
                Wir nutzen Google Ads, um Werbung für unsere Website zu schalten. Dabei werden Cookies verwendet, 
                die eine Analyse des Surfverhaltens der Nutzer ermöglichen. Die durch den Cookie erzeugten 
                Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google 
                in den USA übertragen und dort gespeichert.
              </p>
              <p>
                Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software 
                verhindern. Sie können darüber hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre 
                Nutzung der Website bezogenen Daten an Google sowie die Verarbeitung dieser Daten durch Google 
                verhindern, indem Sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und 
                installieren: https://tools.google.com/dlpage/gaoptout?hl=de
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">4. Kontaktformular</h3>
              <p>
                Wenn Sie das Kontaktformular nutzen, werden die von Ihnen angegebenen Daten zur Bearbeitung 
                Ihrer Anfrage gespeichert. Diese Daten umfassen:
              </p>
              <ul className="list-disc pl-6">
                <li>Name</li>
                <li>E-Mail-Adresse</li>
                <li>Ihre Nachricht</li>
              </ul>
              <p>
                Die Daten werden ausschließlich für die Bearbeitung Ihrer Anfrage verwendet und nach 
                Abschluss der Bearbeitung gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">5. Ihre Rechte</h3>
              <p>Sie haben folgende Rechte:</p>
              <ul className="list-disc pl-6">
                <li>Auskunft über Ihre gespeicherten personenbezogenen Daten zu erhalten</li>
                <li>Berichtigung unrichtiger personenbezogener Daten</li>
                <li>Löschung Ihrer gespeicherten personenbezogenen Daten</li>
                <li>Einschränkung der Datenverarbeitung</li>
                <li>Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten</li>
                <li>Datenübertragbarkeit</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900">6. Kontakt</h3>
              <p>
                Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten können 
                Sie uns jederzeit kontaktieren.
              </p>
              <div className="mt-4">
                <a 
                  href="/kontakt" 
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Zum Kontaktformular
                </a>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;