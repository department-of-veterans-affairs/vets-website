import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LCSearchResult from './LCSearchResult';

function LicenseCertificationSearchResults({ lcResults }) {
  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <div className="row">
          <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
            Licenses and Certifications Search Results
          </h1>
          <p className="vads-u-color--gray-dark lc-filter-options">
            Showing {lcResults.length} of {lcResults.length} results for:
          </p>
          <p className="lc-filter-options">
            <strong>License/Certification Name: </strong>
          </p>
        </div>
        <div className="row">
          <va-accordion openSingle>
            {lcResults.map((result, index) => {
              return <LCSearchResult key={index} result={result} />;
            })}
          </va-accordion>
        </div>
      </section>
    </div>
  );
}

LicenseCertificationSearchResults.propTypes = {
  lcResults: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  lcResults: state.licenseCertificationSearch.lcResults,
});

export default connect(mapStateToProps)(LicenseCertificationSearchResults);
