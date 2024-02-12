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
          <h4>Sidenav</h4>
        </div>
        <ul className="usa-sidenav-list">
          <li>
            <Link className="usa-current" to="/dashboard">
              Nav section
            </Link>
          </li>
          <li>
            <Link to="/dashboard">Nav section</Link>
          </li>
          <li>
            <Link to="/dashboard">Nav section</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidenav;
