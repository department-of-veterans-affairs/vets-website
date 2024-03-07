import React from 'react';
import { Link } from 'react-router';

const Sidenav = () => {
  return (
    <nav
      className="va-sidebarnav vads-u-width--full"
      id="va-detailpage-sidebar"
    >
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
        </ul>
      </div>
    </nav>
  );
};

export default Sidenav;
