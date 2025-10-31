import React from 'react';
import PropTypes from 'prop-types';
import { ProfileBreadcrumbs } from './ProfileBreadcrumbs';

export const ProfileFullWidthContainer = ({ children, profile2Enabled }) => {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--0">
      <div className="vads-l-row">
        <div className="vads-l-col--12 vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--6">
          {profile2Enabled && <ProfileBreadcrumbs />}
          {/* children will be passed in from React Router one level up */}
          {children}
        </div>
      </div>
    </div>
  );
};

ProfileFullWidthContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  profile2Enabled: PropTypes.bool,
};
