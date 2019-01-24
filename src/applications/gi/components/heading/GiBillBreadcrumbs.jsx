import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

class GiBillBreadcrumbs extends React.Component {
  render() {
    const {
      pathname,
      query: { version },
      search,
    } = this.props.location;
    const root = { pathname: '', query: version ? { version } : {} };
    const facilityCode = this.props.facilityCode;

    const crumbs = [
      <a href="/" key="home">
        Home
      </a>,
      <a href="/education/" key="education">
        Education and Training
      </a>,
      <Link to={root} key="main">
        GI Bill® Comparison Tool
      </Link>,
    ];

    if (pathname.match(/search/)) {
      crumbs.push(
        <Link to={`search/${search}`} key="search-results">
          Search Results
        </Link>,
      );
    }

    if (pathname.match(/profile/)) {
      if (this.props.includeSearch) {
        crumbs.push(
          <button
            type="button"
            className="va-button-link learn-more-button"
            onClick={browserHistory.goBack}
            key="search-results"
          >
            Search Results
          </button>,
        );
      }
      crumbs.push(
        <Link to={`profile/${facilityCode}`} key="result-detail">
          School Details
        </Link>,
      );
    }

    return <Breadcrumbs>{crumbs}</Breadcrumbs>;
  }
}

Breadcrumbs.propTypes = {
  includeSearch: PropTypes.bool,
};

export default GiBillBreadcrumbs;
