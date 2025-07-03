import './App.css';
import React, { useState, useEffect } from 'react';
import LoadingScreen from './screens/loadingScreen';
import HomePage from './screens/HomePage';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return <HomePage />;
}

export default App;
