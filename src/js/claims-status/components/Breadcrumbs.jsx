import React from 'react';
import { buildMobileBreadcrumb, debouncedToggleLinks } from '../../../platform/utilities/ui/breadcrumb-helper';

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
        aria-live="polite"
        aria-relevant="additions text"
        className="va-nav-breadcrumbs"
        id="va-breadcrumbs-claims">
        <p className="usa-sr-only">Breadcrumb navigation will usually show all page links. It will adjust to show only the previous page when zoomed in, or viewed on a mobile device.</p>
        <ol
          className="row va-nav-breadcrumbs-list columns claims-breadcrumbs"
          id="va-breadcrumbs-claims-list">
          {this.props.children}
        </ol>
      </nav>
    );
  }
}

export default Breadcrumbs;
