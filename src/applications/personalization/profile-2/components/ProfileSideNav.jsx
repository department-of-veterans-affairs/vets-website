import React from 'react';
import { Link } from 'react-router';

import { childRoutes } from '../routes';

const ProfileSideNav = () => (
  <nav className="va-sidebarnav" id="va-detailpage-sidebar">
    <div>
      <button
        type="button"
        aria-label="Close this menu"
        className="va-btn-close-icon va-sidebarnav-close"
      />
      <h4>Profile</h4>
      <ul>
        <li>
          <Link
            activeClassName="is-active"
            to={childRoutes.personalInformation.path}
          >
            {childRoutes.personalInformation.name}
          </Link>
        </li>
        <li>
          <Link
            activeClassName="is-active"
            to={childRoutes.militaryInformation.path}
          >
            {childRoutes.militaryInformation.name}
          </Link>
        </li>
        <li>
          <Link activeClassName="is-active" to={childRoutes.directDeposit.path}>
            {childRoutes.directDeposit.name}
          </Link>
        </li>
        <li>
          <Link
            activeClassName="is-active"
            to={childRoutes.accountSecurity.path}
          >
            {childRoutes.accountSecurity.name}
          </Link>
        </li>
        <li>
          <Link
            activeClassName="is-active"
            to={childRoutes.connectedApplications.path}
          >
            {childRoutes.connectedApplications.name}
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default ProfileSideNav;
