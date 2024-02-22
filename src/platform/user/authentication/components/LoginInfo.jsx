import React from 'react';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

export default () => (
  <div className="row">
    <div className="columns small-12">
      <div className="help-info">
        <h2 className="vads-u-margin-top--0">Having trouble signing in?</h2>
        <p className="vads-u-font-size--base">
          Get answers to common questions about{' '}
          <a
            href="/resources/signing-in-to-vagov/"
            target="_blank"
            aria-label="Questions about signing in to VA.gov. (Opens a new window)"
          >
            signing in
          </a>{' '}
          and{' '}
          <a
            href="/resources/verifying-your-identity-on-vagov/"
            target="_blank"
            aria-label="Verifying your identity on VA.gov. (Opens a new window)"
          >
            verifying your identity
          </a>
          .
        </p>
        <p className="vads-u-font-size--base">
          <SubmitSignInForm startSentence /> We're here 24/7.
        </p>
      </div>
    </div>
  </div>
);
