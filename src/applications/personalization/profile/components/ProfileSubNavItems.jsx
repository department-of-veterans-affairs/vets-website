import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { NavLink } from 'react-router-dom';
import { selectIsBlocked } from '../selectors';

function ProfileSubNavItems({ routes, isLOA3, isInMVI, clickHandler = null }) {
  const isBlocked = useSelector(selectIsBlocked); // incompetent, fiduciary flag, deceased

  // Filter out the routes the user cannot access due to
  // not being in MVI/MPI, not having a high enough LOA,
  // or having isBlocked state selector return true
  const filteredRoutes = routes.filter(route => {
    // loa3 check and isBlocked check
    if ((route.requiresLOA3 && !isLOA3) || (route.requiresLOA3 && isBlocked)) {
      return false;
    }

    // mvi check
    return !(route.requiresMVI && !isInMVI);
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
