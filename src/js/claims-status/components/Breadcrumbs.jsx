import React from 'react';
import { buildMobileBreadcrumb, debouncedToggleLinks } from '../../utils/breadcrumb-helper';

class Breadcrumbs extends React.Component {
  componentDidMount() {
    buildMobileBreadcrumb('va-breadcrumbs-claims', 'va-breadcrumbs-claims-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.addEventListener('resize', () => {
      debouncedToggleLinks('va-breadcrumbs-claims-list');
      debouncedToggleLinks.bind(this);
    });
  }

  componentDidUpdate() {
    buildMobileBreadcrumb('va-breadcrumbs-claims', 'va-breadcrumbs-claims-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.addEventListener('resize', () => {
      debouncedToggleLinks('va-breadcrumbs-claims-list');
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
        className="va-nav-breadcrumbs"
        id="va-breadcrumbs-claims">
        <ul
          className="row va-nav-breadcrumbs-list columns claims-breadcrumbs"
          id="va-breadcrumbs-claims-list"
          role="menubar">
          {this.props.children}
        </ul>
      </nav>
    );
  }
}

export default Breadcrumbs;
