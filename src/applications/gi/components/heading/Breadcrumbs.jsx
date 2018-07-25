import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

class GibBreadcrumbs extends React.Component {
  render() {
    const {
      pathname,
      query: { version },
      search
    } = this.props.location;
    const facilityCode = this.props.facilityCode;
    const root = { pathname: '/', query: (version ? { version } : {}) };

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/education/" key="education">Education Benefits</a>,
      <a href="/education/gi-bill/" key="gi-bill">GI Bill</a>,
      <Link to={root} key="main">GI Bill® Comparison Tool</Link>
    ];

    if (pathname.match(/search/)) {
      crumbs.push(<Link to={`/search/${search}`} key="search-results">Search Results</Link>);
    }

    if (pathname.match(/profile/)) {
      if (this.props.includeSearch) {
        crumbs.push(
          <a
            onClick={browserHistory.goBack}
            key="search-results">Search Results
          </a>,
          <Link to={`/profile/${facilityCode}`} key="result-detail">School Details</Link>
        );
      } else {
        // User copy-pastes a profile URL, or refreshes page
        crumbs.push(
          <Link to={`/profile/${facilityCode}`} key="result-detail">School Details</Link>
        );
      }
    }

    return (
      <Breadcrumbs>
        {crumbs}
      </Breadcrumbs>
    );
  }
}

GibBreadcrumbs.propTypes = {
  includeSearch: PropTypes.bool,
};

export default GibBreadcrumbs;
