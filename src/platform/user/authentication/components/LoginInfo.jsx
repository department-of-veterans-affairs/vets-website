import React from 'react';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

export default () => (
  <div className="row">
    <div className="usa-width-two-thirds medium-8 columns print-full-width sign-in-wrapper">
      <div className="help-info">
        <h2 className="vads-u-margin-top--0">Having trouble signing in?</h2>
        <p>
          Get answers to common questions about{' '}
          <a href="/resources/signing-in-to-vagov/">signing in</a> and{' '}
          <a href="/resources/verifying-your-identity-on-vagov/">
            verifying your identity
          </a>
          .
        </p>
        <p>
          <SubmitSignInForm startSentence /> We're here 24/7.
        </p>
      </div>
    </div>
  </div>
);
