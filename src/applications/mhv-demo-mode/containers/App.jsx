import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import sessionStorage from 'platform/utilities/storage/sessionStorage';
import { DEMO_MODE_ACKNOWLEDGED, DEMO_SESSION_TIMEOUT_MS } from '../constants';

function isSessionValid() {
  const timestamp = sessionStorage.getItem(DEMO_MODE_ACKNOWLEDGED);
  if (!timestamp) return false;
  return Date.now() - Number(timestamp) < DEMO_SESSION_TIMEOUT_MS;
}

function refreshSession() {
  sessionStorage.setItem(DEMO_MODE_ACKNOWLEDGED, Date.now().toString());
}

export default function App({ children }) {
  const pathname = window.location.pathname.replace(/\/$/, '');
  const isIndexRoute = pathname === '/mhv-demo-mode';
  const isValid = isSessionValid();

  const handleActivity = useCallback(() => {
    if (isSessionValid()) {
      refreshSession();
    }
  }, []);

  useEffect(
    () => {
      const events = ['click', 'keydown', 'scroll'];
      events.forEach(event =>
        window.addEventListener(event, handleActivity, { passive: true }),
      );
      return () => {
        events.forEach(event =>
          window.removeEventListener(event, handleActivity),
        );
      };
    },
    [handleActivity],
  );

  useEffect(
    () => {
      if (!isValid && !isIndexRoute) {
        sessionStorage.removeItem(DEMO_MODE_ACKNOWLEDGED);
        window.location.replace('/mhv-demo-mode');
      }
    },
    [isValid, isIndexRoute],
  );

  if (!isValid && !isIndexRoute) {
    return null;
  }

  return <>{children}</>;
}

App.propTypes = {
  children: PropTypes.node,
};
