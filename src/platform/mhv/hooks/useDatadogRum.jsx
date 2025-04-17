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

const useDatadogRum = config => {
  useEffect(() => {
    if (
      // Prevent RUM from running on local/CI environments.
      environment.BASE_URL.indexOf('localhost') < 0 &&
      // Prevent re-initializing the SDK.
      !window.DD_RUM?.getInitConfiguration() &&
      !window.Mocha
    ) {
      initializeDatadogRum(config);
    }
  }, [config]);
};

// REMINDER: Always be conscience of PII and Datadog
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
  if (
    // // Prevent RUM from running on local/CI environments.
    environment.BASE_URL.indexOf('localhost') < 0 &&
    // Only run if DD is configured.
    window.DD_RUM?.getInitConfiguration() &&
    // Not during unit tests
    !window.Mocha &&
    user?.id
  ) {
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

export { useDatadogRum, setDatadogRumUser };
