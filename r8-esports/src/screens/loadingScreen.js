import React, { useEffect, useState } from 'react';
import './loadingScreen.css';

// Helper to track if the app has loaded before (per session)
function isFirstLoad() {
  if (window.sessionStorage.getItem('hasLoadedOnce')) {
    return false;
  }
  window.sessionStorage.setItem('hasLoadedOnce', 'true');
  return true;
}

function LoadingScreen() {
  const [show, setShow] = useState(isFirstLoad());

  useEffect(() => {
    if (show) {
      // Hide the loading screen after a short delay (e.g., 1.5s)
      const timer = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="loading-container">
      <div className="loader">
        <div className="glow-ring"></div>      
        <div className="loading-text">Cody Banks</div>
      </div>
    </div>
  );
}

export default LoadingScreen;
