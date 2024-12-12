import React from 'react';
import LogoutAlert from './LogoutAlert';
import DowntimeBanners from './DowntimeBanner';

export default function LoginHeader() {
  return (
    <>
      <div className="row">
        <LogoutAlert />
        <div className="columns small-12">
          <h1 id="signin-signup-modal-title" className="vads-u-margin-top--1">
            Sign in or create an account
          </h1>
        </div>
      </div>
      <DowntimeBanners />
    </>
  );
}
