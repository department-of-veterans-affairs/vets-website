import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import cookie from 'cookie';

const checkDdSCookie = () => {
  const cookies = cookie.parse(document.cookie || '');
  const ddSCookie = cookies._dd_s;

  if (!ddSCookie) {
    return;
  }

  const cookieParts = ddSCookie.split('&');
  const idPart = cookieParts.find(part => part.startsWith('id='));

  if (!idPart) {
    // Cookie _dd_s does not have an id value. nullify the cookie to reinitialize the DD_RUM.
    document.cookie = '_dd_s=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};

const initializeDatadogRum = config => {
  checkDdSCookie();
  const datadogRumConfig = config;
  if (!datadogRumConfig.env) {
    datadogRumConfig.env = environment.vspEnvironment();
  }
  datadogRum.init(datadogRumConfig);
  datadogRum.startSessionReplayRecording();
};

const setRumUser = user => {
  datadogRum.setUser({
    ...user,
    id: user.id || 'no-id-found',
  });
};

const shouldRumBeEnabled = () => {
  // Prevent RUM from running on local/CI environments.
  return environment.BASE_URL.indexOf('localhost') < 0 && !window.Mocha;
};

const isRumConfigured = () => {
  // Check if Datadog RUM is configured.
  return !!window.DD_RUM?.getInitConfiguration();
};

const useDatadogRum = config => {
  useEffect(
    () => {
      if (
        shouldRumBeEnabled() &&
        // Prevent re-initializing the SDK.
        !isRumConfigured()
      ) {
        initializeDatadogRum(config);
      }
    },
    [config],
  );
};

// REMINDER: Always be conscious of PII and Datadog
/**
 * Sets the Datadog RUM user information if the environment is not local/CI,
 * Datadog is configured, and the user object has an id.
 *
 * @param {Object} user - The user object containing user information.
 * @param {string} user.id - The user's unique identifier.
 * @param {boolean} user.hasEHRM - Indicates if the user has EHRM access.
 * @param {boolean} user.hasVista - Indicates if the user has Vista access.
 * @param {string} user.CSP - The user's CSP value.
 * @param {string} user.LOA - The user's LOA value.
 * @param {boolean} user.isVAPatient - Indicates if the user is a VA patient.
 */
const setDatadogRumUser = user => {
  if (shouldRumBeEnabled() && isRumConfigured() && user?.id) {
    setRumUser({
      id: user.id,
      hasEHRM: user.hasEHRM,
      hasVista: user.hasVista,
      CSP: user.CSP,
      LOA: user.LOA,
      isVAPatient: user.isVAPatient,
    });
  }
};

// REMINDER: Always be conscious of PII and Datadog
/**
 * Adds user properties to existing Datadog RUM user object if the environment is not local/CI,
 *
 * @param {Object} userData - The user object containing user information.
 */
const addUserProperties = userData => {
  if (shouldRumBeEnabled() && isRumConfigured() && userData) {
    const userProps = Object.entries(userData);
    userProps.forEach(([key, val]) => {
      datadogRum.setUserProperty(key, val);
    });
  }
};

export { addUserProperties, setDatadogRumUser, useDatadogRum };
