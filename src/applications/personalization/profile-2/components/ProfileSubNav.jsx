import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';

import { focusElement } from 'platform/utilities/ui';

export function ProfileMenuItems({
  routes,
  isLOA3,
  isInMVI,
  clickHandler = null,
}) {
  return (
    <ul>
      {routes.map(route => {
        // Do not render route if it is not isLOA3
        if (route.requiresLOA3 && !isLOA3) {
          return null;
        }

        if (route.requiresMVI && !isInMVI) {
          return null;
        }

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

const ProfileSubNav = ({ isInMVI, isLOA3, routes }) => {
  // on first render, set the focus to the h1
  useEffect(() => {
    focusElement('#subnav-header');
  }, []);

  return (
    <nav className="va-subnav" aria-label="Secondary">
      <div>
        <h1 id="subnav-header" className="vads-u-font-size--h4">
          Your profile
        </h1>
        <ProfileMenuItems routes={routes} isLOA3={isLOA3} isInMVI={isInMVI} />
      </div>
    </nav>
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
