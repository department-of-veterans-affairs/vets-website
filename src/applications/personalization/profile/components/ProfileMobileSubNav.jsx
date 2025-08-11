import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import ProfileSubNavItems from './ProfileSubNavItems';

const ProfileMobileSubNav = ({ isLOA3, isInMVI, routes }) => {
  // on first render, set the focus to the h2
  useEffect(() => {
    focusElement('va-sidenav');
  }, []);

  return (
    <ProfileSubNavItems isLOA3={isLOA3} isInMVI={isInMVI} routes={routes} />
  );
};

ProfileMobileSubNav.propTypes = {
  isInMVI: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ProfileMobileSubNav;
