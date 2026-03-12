/**
 * @module @bio-aquia/shared/hooks/useDatadogRum
 * @description Custom hook for initializing Datadog RUM (Real User Monitoring)
 * for VA.gov benefits optimization forms. Provides monitoring, session replay,
 * and user analytics capabilities with comprehensive PII/PHI protection.
 *
 * PII/PHI PROTECTION STRATEGY:
 * ============================
 * This configuration uses a multi-layered approach to protect sensitive data
 * while maintaining full visibility into user interactions and form analytics.
 *
 * 1. AUTOMATIC PROTECTION (defaultPrivacyLevel: 'mask-user-input'):
 *    - All input field values (text, date, SSN, etc.) are automatically masked
 *    - Input error messages are masked
 *    - Form field values in review pages are masked
 *
 * 2. EXPLICIT PROTECTION (data-dd-privacy="mask" attributes):
 *    a) Review field values: shared/components/atoms/review-field/review-field.jsx
 *    b) Review address fields: shared/components/atoms/review-address-field/review-address-field.jsx
 *    c) Confirmation page summaries: All 4 forms' confirmation-page.jsx files
 *    d) Statement of Truth body text with names:
 *       * 21-0779: officialsName in certification statement
 *       * 21-2680: veteranName/claimantName in statement body
 *       * 21p-530a: veteranName in checkbox label
 *    e) Dynamic page titles and field labels with PII (25 total across all forms):
 *       * 21-0779: 1 page (certification-level-of-care.js)
 *       * 21-2680: 8 pages (veteran-ssn, claimant-ssn, hospitalization pages, etc.)
 *       * 21-4192: 16 titles (veteran contact, employment dates, benefits, duty status)
 *       * 21p-530a: 0 (all static titles)
 *
 * 3. ACTION TRACKING (trackUserInteractions: true + data-dd-action-name):
 *    - All masked elements include data-dd-action-name for click/interaction tracking
 *    - Enables analytics visibility while PII remains masked
 *    - Action names are descriptive but generic (e.g., "review field value", "veteran contact page")
 *    - Tracks what users interact with WITHOUT exposing sensitive content
 *
 * 4. SMART MASKING:
 *    - Dynamic titles only masked when they contain actual names (not generic "the Veteran")
 *    - Conditional masking based on content prevents over-masking
 *    - Generic labels remain unmasked for better UX analysis
 *
 * 5. COMPREHENSIVE COVERAGE:
 *    ✅ All input fields (automatic via mask-user-input)
 *    ✅ All review/confirmation data
 *    ✅ All statement of truth sections
 *    ✅ All dynamic page titles/labels with PII
 *    ✅ Error messages associated with inputs
 *    ✅ Address fields in review mode
 *    ✅ User interactions tracked with action names
 *
 * For issues/enhancements: https://github.com/department-of-veterans-affairs/va.gov-team/issues/132463
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
  // Prevent RUM from running on local/CI/test environments
  return (
    !environment.isTest() &&
    environment.BASE_URL.indexOf('localhost') < 0 &&
    !window.Mocha
  );
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
