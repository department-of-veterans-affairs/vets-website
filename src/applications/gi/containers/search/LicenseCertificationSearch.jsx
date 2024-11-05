import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import LicenseCertificationSearchForm from '../../components/LicenseCertificationSearchForm';
import { fetchLicenseCertificationResults } from '../../actions';

function LicenseCertificationSearch({
  dispatchFetchLicenseCertificationResults,
}) {
  const history = useHistory();

  const handleSearch = name => {
    history.push(`/lc-search/results?name=${name}`);
    dispatchFetchLicenseCertificationResults(name); // add filter options as argument
  };

  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <div className="row">
          <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
            Licenses and Certifications
          </h1>
          <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
            Licenses and certifications search page
          </p>
        </div>
        <div className="form-wrapper row">
          <LicenseCertificationSearchForm handleSearch={handleSearch} />
        </div>
      </section>
    </div>
  );
}

LicenseCertificationSearch.propTypes = {
  dispatchFetchLicenseCertificationResults: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  dispatchFetchLicenseCertificationResults: fetchLicenseCertificationResults,
};

export default connect(
  null,
  mapDispatchToProps,
)(LicenseCertificationSearch);
