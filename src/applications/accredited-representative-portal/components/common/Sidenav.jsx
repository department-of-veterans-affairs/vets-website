import React from 'react';
import { Link } from 'react-router';

const Sidenav = () => {
  return (
    <nav className="va-sidebarnav vads-u-width--full">
      <div>
        <div className="left-side-nav-title">
          <h4 data-testid="sidenav-heading">Navigation</h4>
        </div>
        <ul className="usa-sidenav-list">
          <li data-testid="dashboard-sidenav-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li data-testid="poa-requests-sidenav-item">
            <Link to="/poa-requests">POA requests</Link>
          </li>
          <li data-testid="permissions-sidenav-item">
            <Link to="/permissions">Permissions</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidenav;
