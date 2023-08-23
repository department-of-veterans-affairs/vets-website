import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

export default function Placeholder() {
  const dispatch = useDispatch();
  const openSignInModal = useCallback(() => dispatch(toggleLoginModal(true)), [
    dispatch,
  ]);

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <div className="usa-content">
        <h1>We’ve signed you out of VA.gov</h1>
        <va-alert visible status="error">
          You didn’t accept VA online services Terms of Use, so we signed you
          out of the site.
        </va-alert>
        <h2>What you can do:</h2>
        <p>
          If you want to change your answer and accept the terms, sign in again.
          We’ll take you back to the terms of use.{' '}
        </p>
        <p>
          <strong>Note:</strong> You can still get VA benefits without using VA
          online services. If you need help or have questions, call us at
          800-698-2411 (TTY: 711). We’re here 24/7.
        </p>
        <button type="button" onClick={openSignInModal}>
          Sign in
        </button>
      </div>
    </div>
  );
}
