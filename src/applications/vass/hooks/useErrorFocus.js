import { useState, useEffect, useMemo, useRef } from 'react';
import { focusElement } from 'platform/utilities/ui/focus';

/**
 * Custom hook for handling error focus on multiple components
 * @param {string[]} focusSelectors - Array of CSS selectors in priority order (first = highest)
 * @returns {Array<{error: string, handleSetError: Function}>} Array of error/setter pairs
 */
export const useErrorFocus = focusSelectors => {
  // Stabilize the selectors array to prevent unnecessary re-renders
  const [stableSelectors, setStableSelectors] = useState(focusSelectors);
  useEffect(
    () => {
      if (stableSelectors.join() !== focusSelectors.join()) {
        setStableSelectors(focusSelectors);
      }
    },
    [focusSelectors, stableSelectors],
  );

  // a map of selectors to error messages keyed by selector
  const [errors, setErrors] = useState({});
  const needsFocusRef = useRef(false);

  useEffect(
    () => {
      if (needsFocusRef.current) {
        needsFocusRef.current = false;
        const selectorWithError = stableSelectors.find(
          selector => errors[selector],
        );
        if (selectorWithError) {
          focusElement(selectorWithError);
        }
      }
    },
    [stableSelectors, errors],
  );

  return useMemo(
    () => {
      return stableSelectors.map(selector => ({
        error: errors[selector] || '',
        handleSetError: errorMessage => {
          if (errorMessage) {
            needsFocusRef.current = true;
          }
          setErrors(prev => {
            const prevError = prev[selector];
            // only update the error if it has changed
            if (prevError !== errorMessage) {
              return {
                ...prev,
                [selector]: errorMessage,
              };
            }
            return prev;
          });
        },
      }));
    },
    [stableSelectors, errors],
  );
};
