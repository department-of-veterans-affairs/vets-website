import { useEffect, useState, useCallback } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import environment from 'platform/utilities/environment';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import { signupOrVerify } from '../utilities';

export function onVerifyClick({ useOAuth, policy }) {
  if (useOAuth) {
    updateStateAndVerifier(policy);
  }
}
/**
 *
 * @param {String} policy - Value can be either `logingov` or `idme`
 * @param {Boolean} useOAuth - Value should come from `isAuthenticatedWithOAuth` authentication selector
 * @returns {Object} Returns an object of the `href` and `onClick`
 */
export function useIdentityVerificationURL({ policy, useOAuth }) {
  const [href, setHref] = useState('');

  useEffect(
    () => {
      async function generateURL() {
        const url = await signupOrVerify({
          policy,
          allowVerification: true,
          isSignup: false,
          isLink: true,
          useOAuth,
        });
        setHref(url);
      }
      generateURL();
    },
    [policy, useOAuth],
  );

  const onClick = useCallback(onVerifyClick, [useOAuth, policy]);
  return { href, onClick };
}

const initializeDDRum = () => {
  const env = environment.vspEnvironment();

  const {
    sessionSampleRate,
    sessionReplaySampleRate,
    trackInteractions,
    trackUserInteractions,
  } = {
    vagovstaging: {
      sessionSampleRate: 20,
      sessionReplaySampleRate: 1,
      trackInteractions: false,
      trackUserInteractions: false,
    },
    vagovprod: {
      sessionSampleRate: 20,
      sessionReplaySampleRate: 10,
      trackInteractions: true,
      trackUserInteractions: true,
    },
  }[env];

  datadogRum.init({
    applicationId: '',
    clientToken: '',
    site: 'ddog-gov.com',
    service: 'identity',
    env,
    sessionSampleRate,
    sessionReplaySampleRate,
    trackInteractions,
    trackUserInteractions,
    trackFrustrations: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
};

export function useDatadogRum() {
  /**
   * 1. Prevents RUM from running on local/CI environment
   * 2. Prevents re-initializing the SDK.
   */
  useEffect(() => {
    if (
      (environment.isStaging() || environment.isProduction()) &&
      !window.DD_RUM?.getInitConfiguration() &&
      !window.Mocha
    ) {
      initializeDDRum();
    } else {
      delete window?.DD_RUM;
    }
  }, []);
}
