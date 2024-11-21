import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';
import { hasSession } from 'platform/user/profile/utilities';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';
import { focusElement } from '~/platform/utilities/ui';

export default function VerifyApp() {
  const profile = useSelector(selectProfile);

  useEffect(
    () => {
      if (!hasSession() || (hasSession() && profile.verified)) {
        window.location.replace('/');
      }

      document.title = `Verify your identity`; // title should match h1 tag
      recordEvent({ event: 'verify-prompt-displayed' });

      if (!profile?.loading) {
        focusElement('h1');
      }
    },
    [profile.loading, profile.verified],
  );

  if (profile?.loading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message="Loading the application..."
      />
    );
  }

  const { idme, logingov } = SERVICE_PROVIDERS;
  const signInMethod = profile?.signIn?.serviceName ?? 'mhv';
  const singleVerifyButton =
    signInMethod === 'logingov' ? (
      <VerifyLogingovButton />
    ) : (
      <VerifyIdmeButton />
    );

  const deprecationDates = `${
    signInMethod === 'mhv' ? `January 31,` : `September 30,`
  } 2025.`;
  const { label } = SERVICE_PROVIDERS[signInMethod];
  const deprecationDatesContent = (
    <p>
      You’ll need to sign in with a different account after{' '}
      <strong>{deprecationDates}</strong>. After this date, we’ll remove the{' '}
      <strong>{label}</strong> sign-in option. You’ll need to sign in using a{' '}
      <strong>Login.gov</strong> or <strong>ID.me</strong> account.
    </p>
  );

  return (
    <section data-testid="verify-app" className="verify">
      <div className="container">
        <div className="row">
          <div className="columns small-12 fed-warning--v2 vads-u-margin-y--2">
            <h1 className="vads-u-margin-top--2">Verify your identity</h1>
            {![idme.policy, logingov.policy].includes(signInMethod) ? (
              <>
                {deprecationDatesContent}
                <div data-testid="verify-button-group">
                  <VerifyLogingovButton />
                  <VerifyIdmeButton />
                </div>
              </>
            ) : (
              <>
                <p>
                  We need you to verify your identity for your{' '}
                  <strong>{label}</strong> account. This step helps us protect
                  all Veterans’ information and prevent scammers from stealing
                  your benefits.
                </p>
                <p>
                  This one-time process often takes about 10 minutes. You’ll
                  need to provide certain personal information and
                  identification.
                </p>
                <div>{singleVerifyButton}</div>
                <a href="/resources/verifying-your-identity-on-vagov/">
                  Learn more about verifying your identity
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
