// src/pages/ContactPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import NetlifyContactForm from '../components/NetlifyContactForm';

const ContactPage: React.FC = () => {
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
          <NetlifyContactForm />
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
