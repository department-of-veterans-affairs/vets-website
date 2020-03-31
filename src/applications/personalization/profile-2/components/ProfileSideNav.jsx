import React from 'react';
import { Link } from 'react-router';

import { childRoutes } from '../routes';

const ProfileSideNav = () => (
  <nav className="profile-side-nav">
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
        <Link activeClassName="is-active" to={childRoutes.accountSecurity.path}>
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
  </nav>
);

export default ProfileSideNav;
