import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { isLOA3 as isLOA3Selector } from 'platform/user/selectors';

export function ProfileMenuItems({ routes, isLOA3, clickHandler = null }) {
  return (
    <ul>
      {routes.map(route => {
        // Do not render route if it is not isLOA3
        if (route.requiresLOA3 && !isLOA3) {
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

const ProfileSubNav = ({ isLOA3, routes }) => {
  return (
    <nav className="va-subnav" aria-label="Secondary">
      <div>
        <h1 className="vads-u-font-size--h4">Your profile</h1>
        <ProfileMenuItems routes={routes} isLOA3={isLOA3} />
      </div>
    </nav>
  );
};

ProfileSubNav.propTypes = {
  isLOA3: PropTypes.bool.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const mapStateToProps = state => ({
  isLOA3: isLOA3Selector(state),
});

export { ProfileSubNav };

export default connect(mapStateToProps)(ProfileSubNav);
