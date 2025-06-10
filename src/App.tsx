import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CalendarPage from './pages/CalendarPage';
import InfoPage from './pages/InfoPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import { WeekDataProvider } from './context/WeekDataContext';

function App() {
  return (
    <WeekDataProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/datenschutz" element={<PrivacyPage />} />
        </Routes>
      </div>
    </WeekDataProvider>
  );
}

export default App;