import { useState, useEffect, useCallback } from 'react';
import { focusElement } from 'platform/utilities/ui/focus';

/**
 * Custom hook for handling error focus on a component
 * @param {string} focusSelector - CSS selector or attached DOM element to focus on
 * @returns {Object} An object containing the error message and a function to set the error message
 * @returns {string} error - The error message
 * @returns {Function} handleSetError - A function to set the error message
 */
export const useErrorFocus = focusSelector => {
  const [error, setError] = useState('');
  const [focusTrigger, setFocusTrigger] = useState(0);

  const handleSetError = useCallback(
    errorMessage => {
      setError(errorMessage);
      setFocusTrigger(prev => prev + 1);
    },
    [setError, setFocusTrigger],
  );

  useEffect(
    () => {
      if (error) {
        focusElement(focusSelector);
      }
    },
    [error, focusSelector, focusTrigger],
  );

  return { error, handleSetError };
};
