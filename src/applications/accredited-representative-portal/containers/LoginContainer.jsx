import React from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginActions from 'platform/user/authentication/components/LoginActions';
import { EXTERNAL_APPS } from 'platform/user/authentication/constants';
import '../sass/login.scss';

const LoginContainer = () => {
  const [searchParams] = useSearchParams();
  const hasError = searchParams.get('error') === 'true';
  const errorTitle = searchParams.get('title') || '';
  const errorMessage = searchParams.get('message') || '';
  const errorStatus = searchParams.get('status') || 'error';

  const renderErrorMessage = () => {
    if (!hasError) return null;

    return (
      <va-alert
        status={errorStatus}
        className="vads-u-margin-bottom--3"
        visible
      >
        <h2 slot="headline">{errorTitle}</h2>
        <p>{errorMessage}</p>
      </va-alert>
    );
  };

  return (
    <>
      {hasError && renderErrorMessage()}
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
