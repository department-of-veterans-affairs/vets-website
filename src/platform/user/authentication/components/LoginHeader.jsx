import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import LogoutAlert from './LogoutAlert';
import DowntimeBanners from './DowntimeBanner';

export default function LoginHeader({ loggedOut }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isSignInV2 = useToggleValue(TOGGLE_NAMES.signInModalV2);
  return (
    <>
      <div className="row">
        {loggedOut && <LogoutAlert />}
        <div className="columns small-12">
          <h1
            id="signin-signup-modal-title"
            className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2"
          >
            {isSignInV2 ? 'Sign in or create an account' : 'Sign in'}
          </h1>
        </div>
      </div>
      <DowntimeBanners />
    </>
  );
}

LoginHeader.propTypes = {
  loggedOut: PropTypes.bool,
};
