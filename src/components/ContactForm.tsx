import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  // Status: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');
  
    // reCAPTCHA-Token holen …
    let token: string;
    try {
      token = await new Promise<string>((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(SITE_KEY, { action: 'contact' })
            .then(resolve)
            .catch(reject);
        });
      });
    } catch (err) {
      console.error('reCAPTCHA-Token Fehler:', err);
      setErrorMsg('reCAPTCHA-Fehler.');
      setStatus('error');
      return;
    }
  
    const payload = { ...formData, recaptchaToken: token, action: 'contact' };
    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // Body nur einmal lesen:
      const ct = response.headers.get('content-type') || '';
      let bodyData: any;
      if (ct.includes('application/json')) {
        bodyData = await response.json();
      } else {
        bodyData = await response.text();
      }
  
      if (!response.ok) {
        const msg = typeof bodyData === 'string' ? bodyData : bodyData.error || JSON.stringify(bodyData);
        console.error('Server-Antwort Fehler:', msg);
        setErrorMsg(msg || 'Unbekannter Serverfehler');
        setStatus('error');
      } else {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      console.error('Fehler beim Senden:', err);
      setErrorMsg('Netzwerk- oder Serverfehler.');
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
        {status === 'error' && errorMsg && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg">
            <p className="font-medium">Fehler beim Senden:</p>
            <p className="mt-1">{errorMsg}</p>
          </div>
        )}

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

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Ihre Nachricht
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-primary focus:border-primary"
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary flex items-center"
            disabled={status === 'loading'}
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
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Send className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Kontaktieren Sie uns</h2>
      </div>

      {renderContent()}
    </motion.div>
  );
};

export default ContactForm;
