import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { buildMobileBreadcrumb, debouncedToggleLinks } from '../../../../platform/utilities/ui/breadcrumb-helper';

class Breadcrumbs extends React.Component {
  componentDidMount() {
    buildMobileBreadcrumb('va-breadcrumbs-education', 'va-breadcrumbs-education-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.addEventListener('resize', () => {
      debouncedToggleLinks('va-breadcrumbs-education-list');
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
    const { pathname, query: { version } } = this.props.location;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/education/" key="education">Education Benefits</a>,
      <a href="/education/gi-bill/" key="gi-bill">GI Bill</a>,
    ];

    if (pathname.match(/search|profile/)) {
      const root = { pathname: '/', query: (version ? { version } : {}) };
      crumbs.push(<Link to={root} key="main">GI Bill® Comparison Tool</Link>);
    }

    if (pathname.match(/profile/)) {
      if (this.props.includeSearch) {
        crumbs.push(<a onClick={browserHistory.goBack} key="search-results">Search Results</a>);
      }
    }

    return (
      <nav
        aria-label="Breadcrumb"
        aria-live="polite"
        aria-relevant="additions text"
        className="va-nav-breadcrumbs"
        id="va-breadcrumbs-education">
        <p className="usa-sr-only">Breadcrumb navigation will usually show all page links. It will adjust to show only the previous page when zoomed in, or viewed on a mobile device.</p>
        <ol
          className="row va-nav-breadcrumbs-list columns"
          id="va-breadcrumbs-education-list">
          {crumbs.map((c, i) => {
            return <li key={i}>{c}</li>;
          })}
        </ol>
      </nav>
    );
  }
}

Breadcrumbs.propTypes = {
  includeSearch: PropTypes.bool,
};

export default Breadcrumbs;
