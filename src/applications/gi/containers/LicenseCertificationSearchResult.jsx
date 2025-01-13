import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchLcResult } from '../actions';
import LicenseCertificationAdminInfo from '../components/LicenseCertificationAdminInfo';
import LicenseCertificationTestInfo from '../components/LicenseCertificationTestInfo';

function LicenseCertificationSearchResult({
  dispatchFetchLcResult,
  hasFetchedResult,
  resultInfo,
  fetchingLcResult,
}) {
  const { id } = useParams();

  useEffect(() => {
    if (!hasFetchedResult) {
      dispatchFetchLcResult(id);
    }
  }, []);

  const { lacNm, eduLacTypeNm, institution, tests } = resultInfo;

  return (
    <div>
      {fetchingLcResult && (
        <VaLoadingIndicator
          // data-testid="loading-indicator"
          message="Loading..."
        />
      )}
      {!fetchingLcResult &&
      institution &&
      tests && ( // better check for empty resultInfo
          <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
            <div className="row">
              <h1 className="mobile-lg:vads-u-text-align--left">{lacNm}</h1>
              <h2 className="vads-u-margin-top--0">{eduLacTypeNm}</h2>
            </div>
            <div className="row">
              <LicenseCertificationAdminInfo institution={institution} />
            </div>
            <div className="row">
              <LicenseCertificationTestInfo tests={tests} />
            </div>
          </section>
        )}
    </div>
  );
}

LicenseCertificationSearchResult.propTypes = {
  dispatchFetchLcResult: PropTypes.func.isRequired,
  hasFetchedResult: PropTypes.bool.isRequired,
  resultInfo: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchingLcResult: state.licenseCertificationSearch.fetchingLcResult,
  hasFetchedResult: state.licenseCertificationSearch.hasFetchedResult,
  resultInfo: state.licenseCertificationSearch.lcResultInfo,
});

const mapDispatchToProps = {
  dispatchFetchLcResult: fetchLcResult,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicenseCertificationSearchResult);
