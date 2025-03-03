import { useEffect, useState, useCallback } from 'react';
import { updateStateAndVerifier } from 'platform/utilities/oauth/utilities';
import { signupOrVerify, sessionTypeUrl } from '../utilities';

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

/**
 *
 * @param {Object} queryParams - Used for unit testing ONLY
 * @returns {String} URL for VA OCC Mobile test accounts
 */
export function useInternalTestingAuth({
  queryParams = { operation: 'myhealthevet_test_account' },
} = {}) {
  const [href, setHref] = useState('');

  useEffect(() => {
    async function generateURL() {
      const url = await sessionTypeUrl({
        type: 'mhv',
        useOauth: false,
        queryParams,
      });

      setHref(url);
    }

    generateURL();
  }, []);

  return href;
}
