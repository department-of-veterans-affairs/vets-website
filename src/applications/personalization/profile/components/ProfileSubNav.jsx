import React from 'react';
import PropTypes from 'prop-types';
import ProfileSubNavItems from './ProfileSubNavItems';

const ProfileSubNav = ({ isInMVI, isLOA3, routes }) => (
  <ProfileSubNavItems routes={routes} isLOA3={isLOA3} isInMVI={isInMVI} />
);

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
