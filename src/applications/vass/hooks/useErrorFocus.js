import { useState, useEffect, useMemo, useCallback } from 'react';
import { focusElement } from 'platform/utilities/ui/focus';

/**
 * Custom hook for handling error focus on multiple components
 * @param {string[]} focusSelectors - Array of CSS selectors in priority order (first = highest)
 * @returns {Object} Object containing items array and triggerFocus function
 * @returns {Array<{error: string, handleSetError: Function}>} items - Array of error/setter pairs
 * @returns {Function} triggerFocus - Function to trigger focus on the first error
 */
export const useErrorFocus = focusSelectors => {
  // Stabilize the selectors array to prevent unnecessary re-renders
  const selectorsKey = focusSelectors.join('|');
  const stableSelectors = useMemo(
    () => focusSelectors,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectorsKey],
  );

  const [errors, setErrors] = useState(() => stableSelectors.map(() => ''));
  const [focusTrigger, setFocusTrigger] = useState(0);

  const triggerFocus = useCallback(() => {
    setFocusTrigger(prev => prev + 1);
  }, []);

  useEffect(
    () => {
      if (focusTrigger > 0) {
        const errorIndex = errors.findIndex(err => err);
        if (errorIndex !== -1) {
          focusElement(stableSelectors[errorIndex]);
        }
      }
    },
    [stableSelectors, focusTrigger, errors],
  );

  return useMemo(
    () => {
      return stableSelectors.map((_, index) => ({
        error: errors[index],
        handleSetError: errorMessage => {
          setErrors(prev => {
            const next = [...prev];
            next[index] = errorMessage;
            return next;
          });
          if (errorMessage) {
            triggerFocus();
          }
        },
      }));
    },
    [stableSelectors, errors, triggerFocus],
  );
};
