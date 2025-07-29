import './App.css';
import React, { useState, useEffect } from 'react';
import LoadingScreen from './screens/loadingScreen';
import HomePage from './screens/HomePage';
import LandingPage from './screens/LandingPage';
import MockDraft from './screens/MockDraft';
import PlayersStatistic from './screens/PlayersStatistic';
import WeeklyReport from './screens/WeeklyReport';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminIndex from './admin/AdminIndex';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Wrapper component to handle loading states
function PageWrapper({ children, setLoading }) {
  const location = useLocation();

  useEffect(() => {
    // Immediately show loading screen and disable scrolling
    document.body.classList.add('loading');
    setLoading(true);
    
    // Add a small delay to ensure loading screen appears before content
    const timer = setTimeout(() => {
      setLoading(false);
      // Remove loading class after loading is complete
      document.body.classList.remove('loading');
    }, 600); // Reduced to 600ms for faster transitions
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('loading');
    };
  }, [location, setLoading]);

  return children;
}

function AppRoutes({ setLoading }) {
  return (
    <PageWrapper setLoading={setLoading}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={<AdminIndex />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/mock-draft" element={
          <ProtectedRoute>
            <MockDraft />
          </ProtectedRoute>
        } />
        <Route path="/players-statistic" element={
          <ProtectedRoute>
            <PlayersStatistic />
          </ProtectedRoute>
        } />
        <Route path="/weekly-report" element={
          <ProtectedRoute>
            <WeeklyReport />
          </ProtectedRoute>
        } />
      </Routes>
    </PageWrapper>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  // Add loading class to body on initial load
  useEffect(() => {
    document.body.classList.add('loading');
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.classList.remove('loading');
    }, 600);
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('loading');
    };
  }, []);

  return (
    <Router>
      {loading && <LoadingScreen />}
      <AppRoutes setLoading={setLoading} />
    </Router>
  );
}

export default App;
