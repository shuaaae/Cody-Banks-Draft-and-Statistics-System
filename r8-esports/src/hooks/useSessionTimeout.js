import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useSessionTimeout = (timeoutMinutes, sessionKey, redirectPath) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = () => {
    lastActivityRef.current = Date.now();
  };

  const checkSession = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    const timeoutMs = timeoutMinutes * 60 * 1000; // Convert minutes to milliseconds

    if (timeSinceLastActivity >= timeoutMs) {
      // Session expired, logout user
      localStorage.removeItem(sessionKey);
      localStorage.removeItem(sessionKey === 'adminUser' ? 'adminAuthToken' : 'authToken');
      
      // Show notification
      alert(`Session expired due to ${timeoutMinutes} minutes of inactivity. Please log in again.`);
      
      // Redirect to appropriate login page
      navigate(redirectPath);
      return;
    }

    // Schedule next check in 1 minute
    timeoutRef.current = setTimeout(checkSession, 60000);
  }, [timeoutMinutes, sessionKey, redirectPath, navigate]);

  useEffect(() => {
    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the session check
    checkSession();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [checkSession]);

  return { resetTimer };
};

export default useSessionTimeout; 