import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { SIGN_IN_URL, SIGN_OUT_URL } from '../../../../constants';
import { selectUser } from '../../../../selectors/user';

const UserNav = ({ isMobile }) => {
  const { isLoading, profile } = useSelector(selectUser);

  if (isLoading) {
    return <VaLoadingIndicator />;
  }

  if (!profile && isMobile) {
    return (
      <a
        href={SIGN_IN_URL}
        data-testid="mobile-logo-row-sign-in-link"
        className="sign-in-link"
      >
        Sign in
      </a>
    );
  }

  if (!profile && !isMobile) {
    return (
      <a
        href={SIGN_IN_URL}
        data-testid="wider-than-mobile-logo-row-sign-in-link"
        className="usa-button usa-button-primary"
      >
        Sign in
      </a>
    );
  }

  return (
    <div className="sign-in-nav">
      <div className="sign-in-links">
        <a
          data-testid="user-nav-sign-out-link"
          href={SIGN_OUT_URL}
          className="sign-in-link"
        >
          {profile.lastName}
        </a>
      </div>
    </div>
  );
};

UserNav.propTypes = {
  isMobile: PropTypes.bool,
};

export default UserNav;
