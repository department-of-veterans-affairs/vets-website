import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

const CheckAppStatusAlert = () => {
  const dispatch = useDispatch();
  return (
    <va-alert status="info" data-testid="hca-check-status-alert">
      <h2 slot="headline">Have you applied for VA health care before?</h2>
      <va-button
        text="Sign in to check your application status"
        data-testid="hca-login-alert-button"
        onClick={() => dispatch(toggleLoginModal(true))}
      />
    </va-alert>
  );
};

export default React.memo(CheckAppStatusAlert);
