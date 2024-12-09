import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LicenseCertificationSearchForm from './LicenseCertificationSearchForm';
import { handleLcResultsSearch } from '../utils/helpers';
import { fetchLicenseCertificationResults } from '../actions';

function LicenseCertificationSearch({
  dispatchFetchLicenseCertificationResults,
  lcResults,
  fetchingLc,
  hasFetchedOnce,
}) {
  const history = useHistory();

  useEffect(() => {
    dispatchFetchLicenseCertificationResults();
  }, []);

  if (fetchingLc) {
    return <h2>Loading</h2>;
  }

  if (hasFetchedOnce && lcResults) {
    return (
      <div>
        <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
          <div className="row">
            <h1 className=" mobile-lg:vads-u-text-align--left">
              Licenses and Certifications
            </h1>
            <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
              Licenses and certifications search page
            </p>
          </div>
          <div className="form-wrapper row">
            <LicenseCertificationSearchForm
              suggestions={lcResults}
              handleSearch={(type, name) =>
                handleLcResultsSearch(history, type, name)
              }
            />
          </div>
        </section>
      </div>
    );
  }
}

LicenseCertificationSearch.propTypes = {
  dispatchFetchLicenseCertificationResults: PropTypes.func.isRequired,
  fetchingLc: PropTypes.bool.isRequired,
  hasFetchedOnce: PropTypes.bool.isRequired,
  lcResults: PropTypes.array,
};

const mapStateToProps = state => ({
  lcResults: state.licenseCertificationSearch.lcResults,
  fetchingLc: state.licenseCertificationSearch.fetchingLc,
  hasFetchedOnce: state.licenseCertificationSearch.hasFetchedOnce,
});

const mapDispatchToProps = {
  dispatchFetchLicenseCertificationResults: fetchLicenseCertificationResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicenseCertificationSearch);
