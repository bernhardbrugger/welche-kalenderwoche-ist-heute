import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      alert('Bitte bestätigen Sie, dass Sie kein Roboter sind.');
      return;
    }

    // Here you would typically send the form data to your backend
    console.log('Form submitted:', { ...formData, recaptchaValue });
    
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    recaptchaRef.current?.reset();
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LehPFUrAAAAAPhabaOPlcNmhA5aFAvxbIguuE0N"
                  theme="light"
                />

                <button
                  type="submit"
                  className="btn-primary w-full md:w-auto"
                >
                  Nachricht senden
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