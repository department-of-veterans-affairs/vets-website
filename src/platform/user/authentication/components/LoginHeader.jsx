import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import LogoutAlert from './LogoutAlert';
import DowntimeBanners from './DowntimeBanner';
import LoginBanners from './LoginBanners';

export default function LoginHeader({ loggedOut }) {
  const displayDirectDepositBanner = useSelector(
    state =>
      toggleValues(state)[
        FEATURE_FLAG_NAMES.profileHideDirectDepositCompAndPen
      ],
  );
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
      {displayDirectDepositBanner && (
        <LoginBanners
          headline="Disability and direct deposit information isn’t available right now"
          displayAdditionalInfo={false}
          bannerType="warning"
          description={
            <>
              We’re sorry. Disability and pension direct deposit information
              isn’t available right now. We’re doing some maintenance work on
              this system.
              <br />
              <span className="vads-u-margin-top--2 vads-u-display--block">
                Check back on Monday, August 15, 2022, to review your
                information
              </span>
            </>
          }
        />
      )}
    </>
  );
}

LoginHeader.propTypes = {
  loggedOut: PropTypes.bool,
};
