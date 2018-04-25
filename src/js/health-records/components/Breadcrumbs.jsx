import { Link } from 'react-router';
import React from 'react';
import { buildMobileBreadcrumb, debouncedToggleLinks } from '../../../platform/utilities/ui/breadcrumb-helper';

class Breadcrumbs extends React.Component {
  componentDidMount() {
    buildMobileBreadcrumb('va-breadcrumbs-healthcare', 'va-breadcrumbs-healthcare-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.addEventListener('resize', () => {
      debouncedToggleLinks('va-breadcrumbs-healthcare-list');
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
    const { location: { pathname } } = this.props;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/health-care/" key="healthcare">Health Care</a>,
    ];

    if (pathname.match(/download\/?$/)) {
      crumbs.push(<Link to="/" key="main">Get Your VA Health Records</Link>);
      crumbs.push(<Link to="/" key="download">Download Your VA Health Records</Link>);
    } else {
      crumbs.push(<Link to="/" key="main">Get Your VA Health Records</Link>);
    }

    return (
      <nav
        aria-label="Breadcrumb"
        aria-live="polite"
        aria-relevant="additions text"
        className="va-nav-breadcrumbs"
        id="va-breadcrumbs-healthcare">
        <p className="usa-sr-only">Breadcrumb navigation will usually show all page links. It will adjust to show only the previous page when zoomed in, or viewed on a mobile device.</p>
        <ol
          className="row va-nav-breadcrumbs-list columns"
          id="va-breadcrumbs-healthcare-list">
          {crumbs.map((c, i) => {
            return <li key={i}>{c}</li>;
          })}
        </ol>
      </nav>
    );
  }
}

export default Breadcrumbs;
