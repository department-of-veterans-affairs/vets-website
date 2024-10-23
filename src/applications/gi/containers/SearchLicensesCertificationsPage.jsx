import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LicenseCertificationSearch from './search/LicenseCertificationSearch';
import LicenseCertificationSearchResults from './search/LicenseCertificationSearchResults';

function SearchLicensesCertificationsPage({ fetchingLc, hasFetchedOnce }) {
  if (fetchingLc) {
    return <h2>Loading</h2>;
  }
  return (
    <div className="lc-search-page">
      {/* <div className="sidebar-wrapper">
        sidebar wrapper
      </div> */}
      <div className="content-wrapper">
        {hasFetchedOnce ? (
          <LicenseCertificationSearchResults />
        ) : (
          <LicenseCertificationSearch />
        )}
      </div>
    </div>
  );
}

SearchLicensesCertificationsPage.propTypes = {
  fetchingLc: PropTypes.bool.isRequired,
  hasFetchedOnce: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
  return {
    fetchingLc: state.licenseCertificationSearch.fetchingLc,
    hasFetchedOnce: state.licenseCertificationSearch.hasFetchedOnce,
  };
};

export default connect(mapStateToProps)(SearchLicensesCertificationsPage);
