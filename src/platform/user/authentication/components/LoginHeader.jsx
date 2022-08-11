import React from 'react';
import PropTypes from 'prop-types';
import LogoutAlert from './LogoutAlert';
import DowntimeBanners from './DowntimeBanner';
import LoginBanners from './LoginBanners';

function checkWebkit() {
  const ua = navigator.userAgent.toLowerCase();

  if (
    ua.indexOf('chrome') === ua.indexOf('android') &&
    ua.indexOf('safari') !== -1
  ) {
    // accessed via a WebKit-based browser
    return true;
  }

  if (ua.includes('crios') || ua.includes('fxios')) {
    return true;
  }
  // check if accessed via a WebKit-based webview
  return (
    ua.indexOf('ipad') !== -1 ||
    ua.indexOf('iphone') !== -1 ||
    ua.indexOf('ipod') !== -1
  );
}
export default function LoginHeader({ loggedOut, isIOS = checkWebkit }) {
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
      {isIOS() && (
        <LoginBanners
          additionalInfoId="ios-bug"
          headline="You may have trouble signing in right now"
          description="We’re sorry. If you're using the Safari browser or an Apple mobile
              device, you may have trouble signing in right now. We’re working
              to fix this problem as fast as we can."
          displayDifferentDeviceContent
        />
      )}
    </>
  );
}

LoginHeader.propTypes = {
  isIOS: PropTypes.bool,
  loggedOut: PropTypes.bool,
};
