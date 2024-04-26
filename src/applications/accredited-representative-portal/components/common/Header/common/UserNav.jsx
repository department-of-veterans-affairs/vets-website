import React from 'react';
import PropTypes from 'prop-types';

import { SIGN_IN_URL, SIGN_OUT_URL } from '../../../../constants';

const UserNav = ({ isLoading, isMobile, profile }) => {
  // TODO: Replace with real data from redux store #80240
  let content = null;

  if (isLoading) {
    content = (
      <>
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-icon-component */}
        <i
          className="fa fa-spinner fa-spin fa-lg"
          data-testid="user-nav-loading-icon"
          aria-hidden="true"
          role="presentation"
        />
      </>
    );
  }

  if (!isLoading && !profile && isMobile) {
    content = (
      <a
        href={SIGN_IN_URL}
        data-testid="user-nav-mobile-sign-in-link"
        className="sign-in-link"
      >
        Sign in
      </a>
    );
  }

  if (!isLoading && !profile && !isMobile) {
    content = (
      <a
        href={SIGN_IN_URL}
        data-testid="user-nav-wider-than-mobile-sign-in-link"
        className="usa-button usa-button-primary"
      >
        Sign in
      </a>
    );
  }

  if (!isLoading && profile) {
    content = (
      <a
        data-testid="user-nav-sign-out-link"
        href={SIGN_OUT_URL}
        className="sign-in-link"
      >
        {profile.firstName} {profile.lastName}
      </a>
    );
  }

  return (
    <div className="user-nav">
      <div className="sign-in-nav">
        <div className="sign-in-links">{content}</div>
      </div>
    </div>
  );
};

UserNav.propTypes = {
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

export default UserNav;
