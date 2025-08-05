import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import ProfileSubNavItems from './ProfileSubNavItems';

const ProfileSubNav = ({ isInMVI, isLOA3, routes }) => {
  // on first render, set the focus to the h2
  useEffect(() => {
    focusElement('#subnav-header');
  }, []);

  return (
    <ProfileSubNavItems routes={routes} isLOA3={isLOA3} isInMVI={isInMVI} />
  );
};

ProfileSubNav.propTypes = {
  isInMVI: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ProfileSubNav;
