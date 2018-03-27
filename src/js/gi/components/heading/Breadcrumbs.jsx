import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { buildMobileBreadcrumb, debouncedToggleLinks } from '../../../utils/breadcrumb-helper';

class Breadcrumbs extends React.Component {
  componentDidMount() {
    buildMobileBreadcrumb('va-breadcrumb-education', 'va-breadcrumb-education-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.addEventListener('resize', () => {
      debouncedToggleLinks('va-breadcrumb-education-list');
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
        className="va-nav-breadcrumbs"
        id="va-breadcrumb-education">
        <ul
          className="row va-nav-breadcrumbs-list columns"
          id="va-breadcrumb-education-list"
          role="menubar">
          {crumbs.map((c, i) => {
            return <li key={i}>{c}</li>;
          })}
        </ul>
      </nav>
    );
  }
}

Breadcrumbs.propTypes = {
  includeSearch: PropTypes.bool,
};

export default Breadcrumbs;
