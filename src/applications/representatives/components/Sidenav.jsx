import React from 'react';
import { Link } from 'react-router';

const Sidenav = () => {
  return (
    <nav className="va-sidebarnav vads-u-width--full">
      <div>
        <div className="left-side-nav-title">
          <h4>Navigation</h4>
        </div>
        <ul className="usa-sidenav-list">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/poa-requests">POA requests</Link>
          </li>
          <li>
            <Link to="/permissions">Permissions</Link>
          </li>
          <li>
            <Link to="/permissions/third-va-level-va">Third level</Link>
          </li>
          <li>
            <Link to="/permissions/third-va-level-va/fourth-poa-level">
              Fourth level
            </Link>
          </li>
          <li>
            <Link to="/permissions/third-va-level-va/fourth-poa-level/fifth-level">
              Fifth level
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidenav;
