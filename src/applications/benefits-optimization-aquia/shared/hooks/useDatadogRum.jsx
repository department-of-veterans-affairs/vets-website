/**
 * @module @bio-aquia/shared/hooks/useDatadogRum
 * @description Custom hook for initializing Datadog RUM (Real User Monitoring)
 * for VA.gov benefits optimization forms. Provides monitoring, session replay,
 * and user analytics capabilities.
 */

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import environment from 'platform/utilities/environment';

/**
 * Shared Datadog RUM configuration for all benefits optimization forms
 */
const DATADOG_CONFIG = {
  applicationId: '0a35332f-5cfb-45dd-bfb8-65e3b219c79c',
  clientToken: 'pub0203ba1878c76bfa8371573c925f9255',
  site: 'ddog-gov.com',
  service: 'benefits-intake-optimization',
  env: environment.vspEnvironment(),
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  trackBfcacheViews: true,
  defaultPrivacyLevel: 'mask-user-input',
};

const SUPPORTED_FORMS = ['21-0779', '21-2680', '21-4192', '21p-530a'];

// Helper functions
const shouldRumBeEnabled = () => {
  const isNotLocalhost = environment.BASE_URL.indexOf('localhost') < 0;
  const isNotTest = !window.Mocha;
  const isStagingOnly = environment.vspEnvironment() === 'staging';
  return isNotLocalhost && isNotTest && isStagingOnly;
};

const isRumConfigured = () => {
  return !!window.DD_RUM?.getInitConfiguration();
};

/**
 * Get user properties for RUM tracking (non-PII only)
 * Safe for both authenticated and unauthenticated users
 * @param {Object} state - Redux state
 * @returns {Object} User properties safe for logging
 */
const selectRumUser = state => {
  const { user } = state;
  return {
    isSignedIn: user?.login?.currentlyLoggedIn || false,
    serviceProvider: user?.profile?.signIn?.serviceName,
    loa: user?.profile?.loa?.current,
  };
};

/**
 * Set user properties in RUM (call after RUM is initialized)
 * Works for both authenticated and unauthenticated users
 * @param {Object} userProps - User properties for tracking
 */
const setRumUserProperties = userProps => {
  if (shouldRumBeEnabled() && isRumConfigured() && userProps) {
    Object.entries(userProps).forEach(([key, val]) => {
      if (val !== undefined) {
        datadogRum.setUserProperty(key, val);
      }
    });
  }
};

/**
 * Initialize Datadog RUM with form-specific configuration
 * @param {string} formId - Form identifier (e.g., '21-0779')
 */
const initializeDatadogRum = formId => {
  if (!SUPPORTED_FORMS.includes(formId)) {
    return;
  }

  if (!shouldRumBeEnabled() || isRumConfigured()) {
    return;
  }

  datadogRum.init(DATADOG_CONFIG);
  datadogRum.startSessionReplayRecording();
  datadogRum.setGlobalContextProperty('formId', formId);
};

/**
 * React hook for initializing Datadog RUM monitoring
 *
 * Automatically tracks user authentication status when available.
 * Works for both authenticated and unauthenticated forms.
 *
 * @param {string} formId - Form identifier (e.g., '21-0779', '21-2680', '21-4192', '21p-530a')
 *
 * @example
 * ```jsx
 * import { useDatadogRum } from '@bio-aquia/shared/hooks';
 *
 * const App = ({ children }) => {
 *   useDatadogRum('21-0779');
 *   return <RoutedSavableApp>{children}</RoutedSavableApp>;
 * };
 * ```
 */
export const useDatadogRum = formId => {
  const userProps = useSelector(selectRumUser);

  useEffect(
    () => {
      initializeDatadogRum(formId);
    },
    [formId],
  );

  useEffect(
    () => {
      setRumUserProperties(userProps);
    },
    [userProps],
  );
};
