import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

export default function Declined() {
  const dispatch = useDispatch();
  const openSignInModal = useCallback(() => dispatch(toggleLoginModal(true)), [
    dispatch,
  ]);

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <div className="usa-content">
        <h1>We’ve signed you out</h1>
        <p>
          You declined the VA online services terms of use, so we've signed you
          out.
        </p>
        <h2>What you can do</h2>
        <p>
          <strong>Note:</strong> You can still get VA health care and benefits
          without using our online services. If you need help or have questions,{' '}
          <SubmitSignInForm /> We’re here 24/7.
        </p>
        <p>
          Or you can change your answer and accept the terms. If you want to
          accept the terms, sign in again. We’ll take you back to the terms of
          use. Then you can continue using VA online services.
        </p>
        <button type="button" onClick={openSignInModal}>
          Sign in
        </button>
      </div>
    </div>
  );
}
