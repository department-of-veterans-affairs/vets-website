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
    <section className="login">
      {hasError && renderErrorMessage()}
      <div className="arp-container">
        <div className="vads-l-row">
          <div className="vads-l-col--12 vads-u-padding-y--5">
            <h1 className="columns vads-u-margin--0">
              Sign in or create an account
            </h1>
            <LoginActions
              externalApplication={EXTERNAL_APPS.ARP}
              isUnifiedSignIn
            />
          </div>
        </div>
        <div className="vads-l-row">
          <div className="columns vads-l-col--12 vads-u-padding-bottom--5">
            <h2 className="vads-u-margin-top--0">Help and support</h2>

            <ul className="vads-u-padding-bottom--3">
              <li className="vads-u-margin--0">
                <a href="/resources/verifying-your-identity-on-vagov/">
                  Verifying your identity
                </a>
              </li>
              <li className="vads-u-margin--0">
                <a href="/resources/can-i-delete-my-logingov-or-idme-account">
                  Deleting your account
                </a>
              </li>
              <li className="vads-u-margin--0">
                <a href="/resources/support-for-common-logingov-and-idme-issues/">
                  Common issues with Login.gov or ID.me
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginContainer;
