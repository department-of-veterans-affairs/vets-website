import React from 'react';
import PropTypes from 'prop-types';
import LogoutAlert from './LogoutAlert';
import DowntimeBanners from './DowntimeBanner';

export default function LoginHeader({ loggedOut }) {
  // Used to get around Cypress E2E lookup of va-modal's sign-in modal h1
  // const HeadingTag =
  //   (window?.cypress ||
  //     (typeof Cypress !== 'undefined' && Cypress.env('CI'))) &&
  //   !isUnifiedSignIn
  //     ? `h2`
  //     : `h1`;

  return (
    <>
      <div className="row">
        {loggedOut && <LogoutAlert />}
        <div className="columns small-12">
          <h1 id="signin-signup-modal-title">Sign in or create an account</h1>
        </div>
      </div>
      <DowntimeBanners />
    </>
  );
}

LoginHeader.propTypes = {
  loggedOut: PropTypes.bool,
};
