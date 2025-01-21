import React from 'react';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

export default () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const mhvButtonDeprecated = useToggleValue(
    TOGGLE_NAMES.mhvCredentialButtonDisabled,
  );
  const supportLinks = [
    { text: 'Sign-in errors', url: '"/resources/signing-in-to-vagov/"' },
    {
      text: 'Verifying your identity',
      url: '/resources/verifying-your-identity-on-vagov/',
    },
    {
      text: 'Deleting your account',
      url: '/resources/can-i-delete-my-logingov-or-idme-account',
    },
    {
      text: 'Common issues with Login.gov or ID.me',
      url: '/resources/support-for-common-logingov-and-idme-issues/',
    },
  ];
  return (
    <div className="row">
      <div className="columns print-full-width sign-in-wrapper">
        <div className="help-info">
          <h2 className="vads-u-margin-top--0">
            {mhvButtonDeprecated
              ? 'Help and support'
              : 'Having trouble signing in?'}
          </h2>
          {mhvButtonDeprecated ? (
            <div>
              <div>
                <div role="list" className="vads-u-padding-bottom--3">
                  {supportLinks.map((link, idx) => (
                    <li className="vads-u-margin--0" key={idx}>
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p>
              Get answers to common{' '}
              <a href="/resources/signing-in-to-vagov/">
                questions about signing in
              </a>{' '}
              and{' '}
              <a href="/resources/verifying-your-identity-on-vagov/">
                verifying your identity
              </a>
              .
            </p>
          )}
          <p>
            <SubmitSignInForm startSentence /> We're here 24/7.
          </p>
        </div>
      </div>
    </div>
  );
};
