import React from 'react';
import PropTypes from 'prop-types';
import LogoutAlert from './LogoutAlert';
import DowntimeBanners from './DowntimeBanner';
import SessionTimeoutAlert from './SessionTimeoutAlert';

export default function LoginHeader({ loggedOut }) {
  const queryParams = new URLSearchParams(window.location.search);
  const isSessionExpired = queryParams.get('status') === 'session_expired';
  const displayLogoutAlert = loggedOut && !isSessionExpired;
  return (
    <>
      <div className="row">
        <DowntimeBanners />
        {displayLogoutAlert && <LogoutAlert />}
        <SessionTimeoutAlert />
        <div className="columns small-12">
          <h1 id="signin-signup-modal-title" className="vads-u-margin-top--1">
            Sign in or create an account
          </h1>
        </div>
      </div>
    </>
  );
}

LoginHeader.propTypes = {
  loggedOut: PropTypes.bool,
};
