import React, { useEffect } from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import AuthenticatedVerify from '../components/AuthenticatedVerify';
import UnauthenticatedVerify from '../components/UnauthenticatedVerify';

export default function VerifyApp() {
  const isUnauthenticated = localStorage.getItem('hasSession') === null;
  const isProduction = environment.isProduction();

  useEffect(
    () => {
      document.title = `Verify your identity`; // title should match h1 tag
      if (isUnauthenticated && isProduction) {
        window.location.replace('/');
      }
    },
    [isUnauthenticated, isProduction],
  );

  return (
    <>
      {isUnauthenticated && !isProduction ? (
        <UnauthenticatedVerify />
      ) : (
        <AuthenticatedVerify />
      )}
    </>
  );
}
