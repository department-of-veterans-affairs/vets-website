import React from 'react';

import LogoutAlert from 'platform/user/authentication/components/LogoutAlert';
import DowntimeBanners from 'platform/user/authentication/components/DowntimeBanner';

export default ({ loggedOut }) => {
  return (
    <>
      <div className="row">
        {loggedOut && <LogoutAlert />}
        <div className="columns small-12">
          <h1 className="vads-u-margin-top--2 vads-u-color--gray-dark medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2">
            Sign in
          </h1>
        </div>
      </div>
      <DowntimeBanners />
    </>
  );
};
