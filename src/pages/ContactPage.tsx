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
 * reCAPTCHA v3 Site Key: Ersetze den Platzhalter durch deinen Key,
 * der in der Google-Konsole für deine Domain freigegeben ist.
 */
const SITE_KEY = "6LcXn1wrAAAAABky4KdsFc_I-c5cUaNIYweWwqsf";
console.log("Loaded SITE_KEY:", SITE_KEY);

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');

    // Wenn reCAPTCHA v3 verwenden:
    if (!SITE_KEY) {
      alert('reCAPTCHA-Site Key fehlt. Bitte SITE_KEY setzen.');
      setStatus('idle');
      return;
    }
    if (!window.grecaptcha) {
      alert('reCAPTCHA-Skript nicht geladen. Bitte index.html prüfen.');
      setStatus('idle');
      return;
    }

    try {
      // Hole reCAPTCHA v3 Token mit action "contact"
      const token: string = await new Promise((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(SITE_KEY, { action: 'contact' })
            .then((tok) => resolve(tok))
            .catch((err) => reject(err));
        });
      });

      // Baue Payload für Backend
      const payload: ContactFormData & { recaptchaToken: string; action: string } = {
        ...formData,
        recaptchaToken: token,
        action: 'contact',
      };

      // Sende an dein Backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let text: string;
        try {
          const data = await response.json();
          text = data.error || JSON.stringify(data);
        } catch {
          text = await response.text();
        }
        console.error('Server-Antwort Fehler:', text);
        setErrorMsg(text || 'Unbekannter Serverfehler');
        setStatus('error');
      } else {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      console.error('Fehler beim Holen des reCAPTCHA-Token oder Senden:', err);
      setErrorMsg('Fehler beim Senden. Bitte später erneut versuchen.');
      setStatus('error');
    }
  };

  const renderContent = () => {
    if (status === 'success') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-50 text-green-800 p-4 rounded-lg text-center"
        >
          <p className="text-lg font-medium">Vielen Dank für Ihre Nachricht!</p>
          <p className="mt-2">Wir werden uns zeitnah bei Ihnen melden.</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 text-primary hover:text-primary-600 font-medium"
          >
            Neue Nachricht senden
          </button>
        </motion.div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fehlermeldung anzeigen */}
        {status === 'error' && errorMsg && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg">
            <p className="font-medium">Fehler beim Senden:</p>
            <p className="mt-1">{errorMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              disabled={status === 'loading'}
            />
          </div>
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
              disabled={status === 'loading'}
            />
          </div>
        </div>

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
            disabled={status === 'loading'}
          />
        </div>

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
            disabled={status === 'loading'}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          {!SITE_KEY && (
            <p className="text-red-600">
              reCAPTCHA v3 Site Key fehlt. Bitte SITE_KEY setzen.
            </p>
          )}
          <button
            type="submit"
            className="btn-primary w-full md:w-auto flex items-center justify-center"
            disabled={status === 'loading' || !SITE_KEY}
          >
            {status === 'loading' ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            {status === 'loading' ? 'Sende...' : 'Nachricht senden'}
          </button>
        </div>
      </form>
    );
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

          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
