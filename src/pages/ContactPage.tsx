// src/pages/ContactPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  useEffect(() => {
    if (SITE_KEY && typeof window !== 'undefined') {
      const src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }, [SITE_KEY]);

  useEffect(() => {
    console.log('Loaded SITE_KEY:', SITE_KEY);
  }, [SITE_KEY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');

    if (!SITE_KEY) {
      alert('reCAPTCHA Site Key fehlt. Bitte Environment-Variable setzen.');
      setStatus('idle');
      return;
    }
    if (!window.grecaptcha) {
      alert('reCAPTCHA-Skript nicht geladen.');
      setStatus('idle');
      return;
    }

    // reCAPTCHA v3 Token holen
    let token: string;
    try {
      await new Promise<void>(res => window.grecaptcha.ready(res));
      const tok = await window.grecaptcha.execute(SITE_KEY, { action: 'contact' });
      if (!tok) throw new Error('Leeres Token');
      token = tok;
      console.log('reCAPTCHA-Token:', token);
    } catch (err) {
      console.error('Fehler beim Abrufen des reCAPTCHA-Tokens:', err);
      setErrorMsg('Fehler beim Abrufen des reCAPTCHA-Tokens.');
      setStatus('error');
      return;
    }

    const payload = { ...formData, recaptchaToken: token, action: 'contact' };
    const endpoint = `${window.location.origin}/.netlify/functions/contact`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.status === 404) {
        console.error('Endpoint nicht gefunden:', endpoint);
        setErrorMsg('Endpoint nicht gefunden (404). Lokal ohne "netlify dev" ist normal; im Live-Deploy muss die Function existieren.');
        setStatus('error');
        return;
      }
      const ct = response.headers.get('content-type') || '';
      let bodyData: any;
      if (ct.includes('application/json')) {
        bodyData = await response.json();
      } else {
        bodyData = await response.text();
      }
      if (!response.ok) {
        const msg = typeof bodyData === 'string'
          ? bodyData
          : bodyData.error || JSON.stringify(bodyData);
        console.error('Server-Antwort Fehler:', msg);
        setErrorMsg(msg || 'Unbekannter Fehler vom Server');
        setStatus('error');
      } else {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      console.error('Fehler beim Senden:', err);
      setErrorMsg('Fehler beim Senden. Bitte später erneut versuchen.');
      setStatus('error');
    }
  };

  const renderContent = () => {
    if (status === 'success') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-50 text-green-800 p-4 rounded-lg text-center">
          <p className="text-lg font-medium">Vielen Dank für Ihre Nachricht!</p>
          <p className="mt-2">Wir werden uns zeitnah bei Ihnen melden.</p>
          <button onClick={() => setStatus('idle')} className="mt-4 text-primary hover:text-primary-600 font-medium">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-primary focus:border-primary"
              required disabled={status==='loading'}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-primary focus:border-primary"
              required disabled={status==='loading'}
            />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Betreff</label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-primary focus:border-primary"
            required disabled={status==='loading'}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Ihre Nachricht</label>
          <textarea
            id="message"
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-primary focus:border-primary"
            required disabled={status==='loading'}
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary flex items-center" disabled={status==='loading'}>
            {status==='loading' ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            {status==='loading' ? 'Sende...' : 'Nachricht senden'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kontaktieren Sie uns</h1>
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
