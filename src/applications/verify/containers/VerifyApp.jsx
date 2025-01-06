import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import AuthenticatedVerify from '../components/AuthenticatedVerify';
import UnauthenticatedVerify from '../components/UnauthenticatedVerify';

export default function VerifyApp({ env = environment }) {
  const isUnauthenticated = localStorage.getItem('hasSession') === null;
  const isProduction = env?.isProduction();

  useEffect(
    () => {
      document.title = `Verify your identity`; // title should match h1 tag

      if (
        isUnauthenticated &&
        isProduction &&
        window.location.pathname !== '/verify'
      ) {
        window.location.replace('/verify');
      }
    },
    [isUnauthenticated, isProduction],
  );
  return (
    <>
      {isUnauthenticated ? <UnauthenticatedVerify /> : <AuthenticatedVerify />}
    </>
  );
}

VerifyApp.propTypes = {
  env: PropTypes.object,
};
