import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { recordType2FailureEvent } from '../utils/analytics';

const Type2FailureAnalyticsContext = createContext(null);

// Export debounce constant for testing
export const DEBOUNCE_MS = 200;

/**
 * Coordinator for Type 2 failure analytics on claims list page.
 *
 * Manages registration of slim alerts and fires a single analytics event
 * with the total count after all alerts have had a chance to mount.
 *
 * Uses a debounced approach to handle:
 * - Async rendering
 * - React 18 concurrent features
 * - Slow devices
 * - Mount order variations
 *
 * Ensures exactly one analytics event per page load regardless of:
 * - Number of alerts
 * - Mount order
 * - Re-renders
 */
export function Type2FailureAnalyticsProvider({ children }) {
  // Set of registered alert keys (claim IDs)
  const registeredAlertsRef = useRef(new Set());
  // Timer for debounced event firing
  const timerRef = useRef(null);
  // Flag to track if event has been fired for this page load
  const hasFiredRef = useRef(false);
  /**
   * Fires the analytics event with total count of registered alerts.
   * Only fires once per provider mount (page load).
   */
  const fireEvent = useCallback(() => {
    // Guard for server-side rendering (SSR) - don't fire events server-side
    if (typeof window === 'undefined') {
      return;
    }

    const count = registeredAlertsRef.current.size;
    // Only fire if we have alerts and haven't fired yet
    if (count > 0 && !hasFiredRef.current) {
      recordType2FailureEvent({ count });

      hasFiredRef.current = true;
    }
  }, []);

  /**
   * Debounced fire function - waits for registration to stabilize.
   *
   * Uses 200ms debounce window because:
   * - React 18 concurrent rendering can delay sequential mounts
   * - Provides buffer for slower devices/networks
   */
  const scheduleFire = useCallback(
    () => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Schedule new fire
      timerRef.current = setTimeout(() => {
        fireEvent();
        timerRef.current = null;
      }, DEBOUNCE_MS);
    },
    [fireEvent],
  );

  /**
   * Registers an alert. Idempotent - registering same key twice has no effect.
   * @param {string} alertKey - Unique identifier for the alert (typically claim ID)
   */
  const registerAlert = useCallback(
    alertKey => {
      // Guard for server-side rendering (SSR)
      if (typeof window === 'undefined') {
        return;
      }

      const needsToBeAdded = !registeredAlertsRef.current.has(alertKey);

      if (needsToBeAdded) {
        registeredAlertsRef.current.add(alertKey);
        scheduleFire();
      }
    },
    [scheduleFire],
  );

  /**
   * Unregisters an alert. Idempotent - safe to call multiple times.
   * @param {string} alertKey - Unique identifier for the alert
   */
  const unregisterAlert = useCallback(alertKey => {
    registeredAlertsRef.current.delete(alertKey);
    // If all alerts unmount, clear any pending timer
    // Note: Do NOT reset hasFiredRef here - we want one event per provider mount,
    // not one per batch. Provider unmount will reset the flag.
    if (registeredAlertsRef.current.size === 0 && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on provider unmount - ensures clean state for re-mount
  useEffect(() => {
    return () => {
      // Clear pending timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // Reset all state for clean re-mount
      // This is intentional cleanup of refs on unmount - safe and necessary for re-mount scenarios
      // eslint-disable-next-line react-hooks/exhaustive-deps
      registeredAlertsRef.current.clear();
      hasFiredRef.current = false;
    };
  }, []);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({
      registerAlert,
      unregisterAlert,
    }),
    [registerAlert, unregisterAlert],
  );

  return (
    <Type2FailureAnalyticsContext.Provider value={contextValue}>
      {children}
    </Type2FailureAnalyticsContext.Provider>
  );
}

Type2FailureAnalyticsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook for slim alerts to register themselves with the analytics coordinator.
 *
 * Call this hook in components that display Type 2 failure slim alerts.
 * The hook handles registration/unregistration automatically on mount/unmount.
 *
 * @param {Object} params - Hook parameters
 * @param {string} params.alertKey - Unique identifier for this alert (typically claim ID)
 * @param {boolean} params.hasFailures - Whether this alert should be counted
 *
 * @example
 * function UploadType2ErrorAlertSlim({ failedSubmissions, claimId }) {
 *   const hasFailures = failedSubmissions && failedSubmissions.length > 0;
 *   useSlimAlertRegistration({ alertKey: claimId, hasFailures });
 *
 *   if (!hasFailures) return null;
 *   return <VaAlert>...</VaAlert>;
 * }
 */
export function useSlimAlertRegistration({ alertKey, hasFailures }) {
  const context = useContext(Type2FailureAnalyticsContext);

  useEffect(
    () => {
      // If no context, we're not inside the provider - fail silently
      // This allows the component to work in isolation (tests, storybook, etc.)
      if (!context || !hasFailures) {
        return undefined;
      }
      // Register on mount
      context.registerAlert(alertKey);
      // Unregister on unmount
      return () => {
        context.unregisterAlert(alertKey);
      };
    },
    [context, alertKey, hasFailures],
  );
}
