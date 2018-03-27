import React, { Component } from 'react';
import { buildMobileBreadcrumb, debouncedToggleLinks } from '../../utils/breadcrumb-helper';

class Breadcrumbs extends Component {
  componentDidMount() {
    buildMobileBreadcrumb('va-breadcrumb-discharge', 'va-breadcrumb-discharge-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.addEventListener('resize', () => {
      debouncedToggleLinks('va-breadcrumb-discharge-list');
      debouncedToggleLinks.bind(this);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.removeEventListener('resize', () => {
      debouncedToggleLinks.bind(this);
    });
  }

  render() {
    return (
      <nav
        aria-label="Breadcrumbs"
        className="va-nav-breadcrumbs"
        id="va-breadcrumb-discharge">
        <ul
          className="row va-nav-breadcrumbs-list columns"
          id="va-breadcrumb-discharge-list"
          role="menubar">
          <li><a href="/" id="dw-home-link">Home</a></li>
          <li><a href="/discharge-upgrade-instructions/">Discharge Upgrade Instructions</a></li>
        </ul>
      </nav>
    );
  }
}

export default Breadcrumbs;
