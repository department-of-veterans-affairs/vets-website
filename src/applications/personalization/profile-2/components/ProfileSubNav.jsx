import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';

export function ProfileMenuItems({ routes, clickHandler = null }) {
  return (
    <ul>
      {routes.map(route => {
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

const ProfileSubNav = ({ routes }) => {
  return (
    <nav className="va-subnav" aria-label="Secondary">
      <div>
        <h1 className="vads-u-font-size--h4">Your profile</h1>
        <ProfileMenuItems routes={routes} />
      </div>
    </nav>
  );
};

ProfileSubNav.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ProfileSubNav;
