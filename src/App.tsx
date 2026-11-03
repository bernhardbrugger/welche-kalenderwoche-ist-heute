import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sky from './components/Sky';
import { WeekDataProvider } from './context/WeekDataContext';
import CalendarPage from './pages/CalendarPage';
import ContactPage from './pages/ContactPage';
import InfoPage from './pages/InfoPage';
import PrivacyPage from './pages/PrivacyPage';

function App() {
  return (
    <WeekDataProvider>
      <Sky />
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/kw/:year/:week" element={<CalendarPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/datenschutz" element={<PrivacyPage />} />
        </Routes>
      </div>
    </WeekDataProvider>
  );
}

export default App;
