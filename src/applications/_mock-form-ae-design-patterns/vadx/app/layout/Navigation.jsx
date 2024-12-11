import React from 'react';
import { Link } from 'react-router';

export const NavigationTemp = () => {
  return (
    <ul className="vads-u-margin--0 vads-u-padding-left--0">
      <li className="vads-u-margin-bottom--1">
        <Link
          to="/vadx/server-control"
          className="vads-u-text-decoration--none vads-u-color--primary"
          activeClassName="vads-u-font-weight--bold"
        >
          Server Control
        </Link>
      </li>
      <li>
        <Link
          to="/vadx/debug"
          className="vads-u-text-decoration--none vads-u-color--primary"
          activeClassName="vads-u-font-weight--bold"
        >
          Debug
        </Link>
      </li>
      <li className="vads-u-margin-bottom--1">
        <Link
          to="/vadx/feature-toggles"
          className="vads-u-text-decoration--none vads-u-color--primary"
          activeClassName="vads-u-font-weight--bold"
        >
          Feature Toggles
        </Link>
      </li>
      <li>
        <Link
          to="/vadx/form-tester"
          className="vads-u-text-decoration--none vads-u-color--primary"
          activeClassName="vads-u-font-weight--bold"
        >
          Form Tester
        </Link>
      </li>
    </ul>
  );
};

export const Navigation = () => {
  return (
    <nav aria-label="Side navigation,">
      <ul className="usa-sidenav-list">
        <li className="usa-sidenav-item">
          <Link
            to="/vadx"
            activeClassName="vads-u-font-weight--bold usa-current"
          >
            Development Servers
          </Link>
        </li>
        <li className="usa-sidenav-item">
          <Link
            to="/vadx/debug"
            activeClassName="vads-u-font-weight--bold usa-current"
          >
            Debug
          </Link>
        </li>
        <li className="usa-sidenav-item">
          <Link
            to="/vadx/feature-toggles"
            activeClassName="vads-u-font-weight--bold usa-current"
          >
            Feature Toggles
          </Link>
        </li>
      </ul>
    </nav>
  );
};
