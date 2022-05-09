import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, matchPath } from 'react-router-dom';

const ProfileAccessibleHeader = ({ routes }) => {
  const location = useLocation();

  const currentRoute = routes.find(route =>
    matchPath(location.pathname, route),
  );

  return (
    <>
      <h1
        tabIndex="-1"
        className="vads-u-visibility--screen-reader"
        data-focus-target
      >
        {currentRoute?.name}
      </h1>
    </>
  );
};

ProfileAccessibleHeader.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      requiresLOA3: PropTypes.bool.isRequired,
      requiresMVI: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default ProfileAccessibleHeader;
