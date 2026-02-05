import React, { createContext, useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'demoMode';

const DemoModeContext = createContext(null);

const getStoredValue = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const setStoredValue = value => {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // localStorage not available
  }
};

/**
 * Provides demo mode state to all children components.
 * Persists state to localStorage for cross-session persistence.
 */
export const DemoModeProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(getStoredValue);

  const toggle = useCallback(() => {
    setIsActive(prev => {
      const newState = !prev;
      setStoredValue(newState);
      return newState;
    });
  }, []);

  return (
    <DemoModeContext.Provider value={{ isActive, toggle }}>
      {children}
    </DemoModeContext.Provider>
  );
};

DemoModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to access demo mode state and toggle function.
 * Returns safe defaults if used outside DemoModeProvider.
 *
 * @returns {{ isActive: boolean, toggle: () => void }}
 */
export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) {
    return { isActive: false, toggle: () => {} };
  }
  return context;
};
