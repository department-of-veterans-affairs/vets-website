import React, { Component } from 'react';
import { buildMobileBreadcrumb, debouncedToggleLinks } from '../../utils/breadcrumb-helper';

class Breadcrumbs extends Component {
  componentDidMount() {
    buildMobileBreadcrumb('va-breadcrumbs-discharge', 'va-breadcrumbs-discharge-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.addEventListener('resize', () => {
      debouncedToggleLinks('va-breadcrumbs-discharge-list');
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
        aria-label="Breadcrumb"
        aria-live="polite"
        aria-relevant="additions text"
        className="va-nav-breadcrumbs"
        id="va-breadcrumbs-discharge">
        <p className="usa-sr-only">Breadcrumb navigation will usually show all page links. It will adjust to show only the previous page when zoomed in, or viewed on a mobile device.</p>
        <ol
          className="row va-nav-breadcrumbs-list columns claims-breadcrumbs"
          id="va-breadcrumbs-discharge-list">
          <li><a href="/" id="dw-home-link">Home</a></li>
          <li><a href="/discharge-upgrade-instructions/">Discharge Upgrade Instructions</a></li>
        </ol>
      </nav>
    );
  }
}

export default Breadcrumbs;
