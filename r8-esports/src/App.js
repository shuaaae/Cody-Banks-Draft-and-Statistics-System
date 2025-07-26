import './App.css';
import React, { useState, useEffect } from 'react';
import LoadingScreen from './screens/loadingScreen';
import HomePage from './screens/HomePage';
import LandingPage from './screens/LandingPage';
import MockDraft from './screens/MockDraft';
import PlayersStatistic from './screens/PlayersStatistic';
import TeamHistory from './screens/TeamHistory';
import WeeklyReport from './screens/WeeklyReport';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function AppRoutes({ setLoading }) {
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [location, setLoading]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/mock-draft" element={<MockDraft />} />
      <Route path="/players-statistic" element={<PlayersStatistic />} />
      <Route path="/team-history" element={<TeamHistory />} />
      <Route path="/weekly-report" element={<WeeklyReport />} />
    </Routes>
  );
}

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <Router>
      {loading && <LoadingScreen />}
      <AppRoutes setLoading={setLoading} />
    </Router>
  );
}

export default App;
