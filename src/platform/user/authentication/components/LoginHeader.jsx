import React from 'react';
import DowntimeBanners from './DowntimeBanner';
import SessionTimeoutAlert from './SessionTimeoutAlert';
import LoginGovStateDowntimeBanner from './LoginGovStateDowntimeBanner';

export default function LoginHeader() {
  return (
    <div className="row">
      <DowntimeBanners />
      <LoginGovStateDowntimeBanner />
      <SessionTimeoutAlert />
      <div className="columns small-12">
        <h1 id="signin-signup-modal-title" className="vads-u-margin-top--1">
          Sign in or create an account
        </h1>
      </div>
    </div>
  );
}
