// src/pages/ContactPage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

/**
 * Interface für die Formulardaten
 */
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Dein reCAPTCHA v3 Site Key (sichtbar im Client ist normal).
 * Ersetze hier den Platzhalter durch deinen echten Key aus der Google-Konsole.
 */
const SITE_KEY = "DEIN_RECAPTCHA_V3_SITE_KEY_HIER";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // Prüfe, ob grecaptcha geladen ist
    if (!window.grecaptcha) {
      alert('reCAPTCHA-Skript nicht geladen. Bitte index.html prüfen.');
      setLoading(false);
      return;
    }

    try {
      // Hole reCAPTCHA v3 Token mit action "contact"
      const token: string = await new Promise((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(SITE_KEY, { action: 'contact' })
            .then((tok) => {
              resolve(tok);
            })
            .catch((err) => {
              reject(err);
            });
        });
      });

      // Baue Payload für Backend
      const payload: ContactFormData & { recaptchaToken: string; action: string } = {
        ...formData,
        recaptchaToken: token,
        action: 'contact',
      };

      // Sende an dein Backend.
      // Passe URL je nach Setup an:
      // - Bei Next.js API z.B. '/api/contact'
      // - Bei Netlify Functions z.B. '/.netlify/functions/contact'
      // - Bei eigenem Server ggf. volle URL oder Proxy-Pfad
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server-Antwort Fehler:', errorText);
        alert('Fehler beim Senden: ' + errorText);
      } else {
        setIsSubmitted(true);
        // Formular zurücksetzen
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error('Fehler beim Holen des reCAPTCHA-Token oder Senden:', err);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Kopfbereich */}
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kontaktieren Sie uns
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Haben Sie Fragen, Anregungen oder Feedback? Wir freuen uns über Ihre Nachricht 
            und werden uns zeitnah bei Ihnen melden.
          </p>
        </header>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Send className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Kontaktformular</h2>
          </div>

          {isSubmitted ? (
            // Erfolgsmeldung
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 text-green-800 p-4 rounded-lg text-center"
            >
              <p className="text-lg font-medium">Vielen Dank für Ihre Nachricht!</p>
              <p className="mt-2">Wir werden uns zeitnah bei Ihnen melden.</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-primary hover:text-primary-600 font-medium"
              >
                Neue Nachricht senden
              </button>
            </motion.div>
          ) : (
            // Formular
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                {/* E-Mail */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Betreff */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Betreff
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              {/* Nachricht */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Ihre Nachricht
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              {/* Submit-Button */}
              <div className="flex flex-col items-center gap-4">
                {!SITE_KEY && (
                  <p className="text-red-600">
                    reCAPTCHA v3 Site Key fehlt. Bitte SITE_KEY oben setzen.
                  </p>
                )}
                <button
                  type="submit"
                  className="btn-primary w-full md:w-auto"
                  disabled={loading || !SITE_KEY}
                >
                  {loading ? 'Sende...' : 'Nachricht senden'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
