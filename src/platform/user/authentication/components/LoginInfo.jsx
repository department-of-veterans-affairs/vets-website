import React from 'react';
import { useSelector } from 'react-redux';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

export default () => {
  const mhvButtonDeprecated = useSelector(
    state => state?.featureToggles?.mhvCredentialButtonDisabled,
  );
  return (
    <div className="row">
      <div className="columns print-full-width sign-in-wrapper">
        <div className="help-info">
          <h2 className="vads-u-margin-top--0">Having trouble signing in?</h2>
          {mhvButtonDeprecated ? (
            <div>
              <p>Get help with questions about:</p>
              <div>
                <div role="list" className="vads-u-padding-bottom--3">
                  <li>
                    <a href="/resources/signing-in-to-vagov/">signing in</a>
                  </li>
                  <li>
                    <a href="/resources/verifying-your-identity-on-vagov/">
                      verifying your identity
                    </a>
                  </li>
                  <li>
                    <a href="/resources/verifying-your-identity-on-vagov/">
                      deleting your account
                    </a>
                  </li>
                </div>
              </div>
              <va-link
                text="The My HealtheVet sign-in option is no loner available"
                label="The My HealtheVet sign-in option is no longer available"
                href="/"
                className="vads-u-margin-top--3"
              />
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
