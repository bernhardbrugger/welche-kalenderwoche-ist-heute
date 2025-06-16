// src/components/NetlifyContactForm.tsx
import React, { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const NetlifyContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);
    // data enthält name, email, subject, message, bot-field

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as any).toString(),
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg('Fehler beim Senden. Bitte versuche es später erneut.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Netzwerkfehler. Bitte prüfe deine Verbindung.');
    }
  };

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Pflichtfeld für Netlify Forms */}
      <input type="hidden" name="form-name" value="contact" />
      {/* Honeypot zum Schutz gegen Spam */}
      <p className="hidden">
        <label>
          Don’t fill this out if you’re human: <input name="bot-field" />
        </label>
      </p>

      {status === 'error' && errorMsg && (
        <div className="bg-red-50 text-red-800 p-3 rounded-lg">
          <p className="font-medium">Fehler beim Senden:</p>
          <p className="mt-1">{errorMsg}</p>
        </div>
      )}
      {status === 'success' && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center">
          <p className="text-lg font-medium">Vielen Dank! Ihre Nachricht wurde gesendet.</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
          required
          disabled={status === 'loading' || status === 'success'}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
          required
          disabled={status === 'loading' || status === 'success'}
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Betreff
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={e => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
          required
          disabled={status === 'loading' || status === 'success'}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Ihre Nachricht
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
          required
          disabled={status === 'loading' || status === 'success'}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary flex items-center"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            'Nachricht senden'
          )}
        </button>
      </div>
    </form>
  );
};

export default NetlifyContactForm;
