import React from 'react';
import PropTypes from 'prop-types';
import LogoutAlert from 'platform/user/authentication/components/LogoutAlert';
import DowntimeBanners from 'platform/user/authentication/components/DowntimeBanner';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';

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
        <div className="downtime-notification row">
          <div className="columns small-12">
            <div className="form-warning-banner">
              <va-alert visible status="info">
                <h2 slot="headline">
                  You may have trouble signing in right now
                </h2>
                <p>
                  We’re sorry. If you're using the Safari browser or an Apple
                  mobile device, you may have trouble signing in right now.
                  We’re working to fix this problem as fast as we can.
                </p>
                <va-additional-info
                  id="ios-bug"
                  trigger="Here's what you can do now"
                  disable-border
                >
                  <ul>
                    <li>
                      Try to sign in from a different browser or device. Use a
                      browser other than Safari (like Edge, Chrome, or Firefox).
                      If you're using an iPhone, iPad, or other Apple device,
                      try a different device (like a laptop or desktop
                      computer).
                    </li>
                    <li>
                      If sign in fails, refresh the page in your browser.
                      Refreshing the page may fix the problem.
                    </li>
                  </ul>
                  <p>
                    If you still have trouble signing in, try again later. Or
                    call us at <va-telephone contact={CONTACTS.HELP_DESK} />{' '}
                    (TTY: <va-telephone contact={CONTACTS['711']} />
                    ). We’re here 24/7.
                  </p>
                </va-additional-info>
              </va-alert>
              <br />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

LoginHeader.propTypes = {
  isIOS: PropTypes.bool,
  loggedOut: PropTypes.bool,
};
