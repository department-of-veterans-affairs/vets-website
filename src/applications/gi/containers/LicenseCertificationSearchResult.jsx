import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { fetchLcResult } from '../actions';
import { capitalizeFirstLetter } from '../utils/helpers';
import LicenseCertificationInfoTabs from '../components/LicenseCertificationInfoTabs';

function LicenseCertificationSearchResult({
  dispatchFetchLcResult,
  hasFetchedResult,
  resultInfo,
}) {
  const { type, id } = useParams();

  useEffect(
    () => {
      if (!hasFetchedResult) {
        dispatchFetchLcResult(`lce/${type}/${id}`);
      }
    },
    [dispatchFetchLcResult, hasFetchedResult, type, id],
  );

  const { desc, type: category } = resultInfo;

  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <div className="row">
          <h1 className="mobile-lg:vads-u-text-align--left">{desc}</h1>
          <h2 className="vads-u-margin-top--0">
            {capitalizeFirstLetter(category)}
          </h2>
        </div>
        <div className="row">
          <LicenseCertificationInfoTabs />
        </div>
      </section>
    </div>
  );
}

LicenseCertificationSearchResult.propTypes = {
  dispatchFetchLcResult: PropTypes.func.isRequired,
  hasFetchedResult: PropTypes.bool.isRequired,
  resultInfo: PropTypes.object,
};

const mapStateToProps = state => ({
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
