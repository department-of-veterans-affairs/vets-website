import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';

function ProfileSubNavItems({ routes, isLOA3, isInMVI, clickHandler = null }) {
  // Filter out the routes the user cannot access due to not being in MVI/MPI or
  // not having a high enough LOA
  const filteredRoutes = routes.filter(route => {
    let eligibleRoute = true;

    if (route.requiresLOA3 && !isLOA3) {
      eligibleRoute = false;
    }

    if (route.requiresMVI && !isInMVI) {
      eligibleRoute = false;
    }

    return eligibleRoute;
  });
  return (
    <ul>
      {filteredRoutes.map(route => {
        return (
          <li key={route.path}>
            <NavLink
              activeClassName="is-active"
              exact
              to={route.path}
              onClick={clickHandler}
            >
              {route.name}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

ProfileSubNavItems.propTypes = {
  isInMVI: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  // Optional handler to fire when a nav item is clicked
  clickHandler: PropTypes.func,
};

export default ProfileSubNavItems;
