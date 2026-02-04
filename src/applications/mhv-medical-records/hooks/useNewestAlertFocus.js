import { useEffect, useRef, useCallback, useMemo } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

/**
 * Custom hook to focus on the newest visible alert.
 * Tracks which alerts are visible and focuses on any alert that
 * transitions from hidden to visible.
 *
 * @param {string[]} visibleAlerts - Array of alert keys that are currently visible
 * @returns {Object} { newestAlert, focusRef }
 *
 * @example
 * const visibleAlerts = [];
 * if (showCcdSuccess) visibleAlerts.push('ccdSuccess');
 * if (showSeiError) visibleAlerts.push('seiError');
 *
 * const { newestAlert, focusRef } = useNewestAlertFocus(visibleAlerts);
 *
 * return (
 *   {showCcdSuccess && (
 *     <div ref={newestAlert === 'ccdSuccess' ? focusRef : null}>
 *       <Alert />
 *     </div>
 *   )}
 * );
 */
const useNewestAlertFocus = visibleAlerts => {
  const prevAlertsRef = useRef(new Set());
  const hasFocusedRef = useRef(false);
  const timeoutRef = useRef(null);

  // Calculate newest alert synchronously during render (not in useEffect)
  // This ensures newestAlert is available immediately for ref assignment
  const newestAlert = useMemo(
    () => {
      const prevAlerts = prevAlertsRef.current;
      return visibleAlerts.find(alert => !prevAlerts.has(alert)) || null;
    },
    [visibleAlerts],
  );

  // Update previous alerts AFTER render via effect
  useEffect(
    () => {
      // Reset focus flag when newest alert changes
      if (newestAlert) {
        hasFocusedRef.current = false;
      }
      // Update previous alerts for next comparison
      prevAlertsRef.current = new Set(visibleAlerts);
    },
    [visibleAlerts, newestAlert],
  );

  // Cleanup timeout on unmount to prevent focusing detached nodes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Callback ref that focuses when attached to the newest alert element
  const focusRef = useCallback(
    node => {
      // Clear any pending timeout when node changes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (node && newestAlert && !hasFocusedRef.current) {
        hasFocusedRef.current = true;
        // Small delay to ensure DOM is fully ready
        timeoutRef.current = setTimeout(() => {
          // Try to find and focus the va-alert inside the wrapper
          // This ensures focus lands on the actual alert element (for accessibility and tests)
          const alertElement = node.querySelector('va-alert');
          if (alertElement) {
            focusElement(alertElement);
          } else {
            focusElement(node);
          }
          timeoutRef.current = null;
        }, 100);
      }
    },
    [newestAlert],
  );

  return {
    newestAlert,
    focusRef,
  };
};

export default useNewestAlertFocus;
