import React from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginActions from 'platform/user/authentication/components/LoginActions';
import { EXTERNAL_APPS } from 'platform/user/authentication/constants';
import { getAuthError, AUTH_ERRORS } from 'platform/user/authentication/errors';
import '../sass/login.scss';

const LoginContainer = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const errorCode = searchParams.get('code') || '';
  const requestId = searchParams.get('request_id') || '';

  // Get detailed error information using platform utilities
  const { errorCode: detailedErrorCode } = getAuthError(errorCode);

  const renderErrorMessage = () => {
    // Different messaging based on error type
    switch (detailedErrorCode) {
      case AUTH_ERRORS.INVALID_CREDENTIALS:
        return (
          <va-alert status="error" className="vads-u-margin-bottom--3" visible>
            <h2 slot="headline">We couldn’t verify your identity</h2>
            <p>
              We’re sorry. The credentials you provided couldn’t be verified.
              Please try again or contact the VA Help Desk for assistance at
              1-800-698-2411.
            </p>
          </va-alert>
        );

      case AUTH_ERRORS.ACCOUNT_NOT_FOUND:
        return (
          <va-alert status="error" className="vads-u-margin-bottom--3" visible>
            <h2 slot="headline">We couldn’t find your account</h2>
            <p>
              We’re sorry. We couldn’t find an account matching your sign-in
              information. Make sure you’re using the correct email address or
              username.
            </p>
          </va-alert>
        );

      case AUTH_ERRORS.MULTIFACTOR_REQUIRED:
        return (
          <va-alert
            status="warning"
            className="vads-u-margin-bottom--3"
            visible
          >
            <h2 slot="headline">Additional verification required</h2>
            <p>
              For your security, we need you to complete the multi-factor
              authentication process. Please try signing in again.
            </p>
          </va-alert>
        );

      case 'auth_failed':
      default:
        return (
          <va-alert status="error" className="vads-u-margin-bottom--3" visible>
            <h2 slot="headline">We couldn’t sign you in</h2>
            <p>
              We’re sorry. Something went wrong with the sign-in process. Please
              try again.
            </p>
            {requestId && (
              <p className="vads-u-font-size--sm vads-u-color--gray-medium">
                Request ID: {requestId}
              </p>
            )}
          </va-alert>
        );
    }
  };

  return (
    <>
      {error && renderErrorMessage()}
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 vads-u-padding-y--5">
            <h1>Sign in to the Accredited Representative Portal</h1>
            <LoginActions
              externalApplication={EXTERNAL_APPS.ARP}
              isUnifiedSignIn
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginContainer;
