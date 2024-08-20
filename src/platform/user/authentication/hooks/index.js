import { useEffect, useState, useCallback } from 'react';
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
 * @param {Boolean} useOAuth - Value should come from `isAuthenticatedWithOAuth` auth/selector
 * @returns {Object} Returns an object of the `href` and `onClick`
 */
export function useIdentityVerificationURL({ policy, useOAuth }) {
  const [href, setHref] = useState('');

  // if (['dslogon', 'mhv']?.includes(policy)) {
  //   throw new Error('Please use a valid identity verification `policy`');
  // }

  useEffect(
    () => {
      async function generateURL() {
        const url = await signupOrVerify({
          allowVerification: true,
          isLink: true,
          isSignup: false,
          policy,
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
