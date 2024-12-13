import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { hasSession } from 'platform/user/profile/utilities';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import AuthenticatedVerify from '../components/AuthenticatedVerify';
import UnauthenticatedVerify from '../components/UnauthenticatedVerify';

export default function VerifyApp() {
  const isUnauthenticated = !hasSession();
  const isProduction = environment.isProduction();

  useEffect(
    () => {
      document.title = `Verify your identity`; // title should match h1 tag
      recordEvent({ event: 'verify-prompt-displayed' });
      if (isUnauthenticated && isProduction) {
        window.location.replace('/');
      }
    },
    [isUnauthenticated, isProduction],
  );

  return (
    <>
      {isUnauthenticated && !isProduction ? (
        <UnauthenticatedVerify data-testId="unauthenticatedVerify" />
      ) : (
        <AuthenticatedVerify data-testId="authenticatedVerify" />
      )}
    </>
  );
}
