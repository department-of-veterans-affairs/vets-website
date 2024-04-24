import React from 'react';
import PropTypes from 'prop-types';

import { SIGN_IN_URL, SIGN_OUT_URL } from '../../../../constants';

const UserNav = ({ isMobile }) => {
  let content = null;
  const isLoading = false;
  // const profile = false;
  const profile = { firstName: 'Johnathon', lastName: 'Smith' };

  if (isLoading) {
    content = (
      <>
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-icon-component */}
        <i
          className="fa fa-spinner fa-spin fa-2x"
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
        data-testid="user-nav-sign-in-link"
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
      <div className="sign-in-nav">
        <div className="sign-in-links">
          <a
            data-testid="user-nav-sign-out-link"
            href={SIGN_OUT_URL}
            className="sign-in-link"
          >
            {profile.firstName} {profile.lastName}
          </a>
        </div>
      </div>
    );
  }

  return <div className="user-nav">{content}</div>;
};

UserNav.propTypes = {
  isMobile: PropTypes.bool,
};

export default UserNav;
