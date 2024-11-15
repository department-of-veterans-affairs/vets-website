import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LicenseCertificationResultInfo from '../components/LicenseCertificationResultInfo';
import { fetchLcResult } from '../actions';

function LicenseCertificationSearchResult({
  result,
  hasFetchedResult,
  dispatchFetchLcResult,
  resultInfo,
}) {
  const { link, type, name } = result;

  const handleClick = () => {
    dispatchFetchLcResult(link);
  };

  return (
    <va-accordion-item
      id={name}
      header={name}
      subheader={type}
      onClick={() => handleClick()}
    >
      {hasFetchedResult ? (
        <LicenseCertificationResultInfo resultInfo={resultInfo} />
      ) : (
        <h3>Loading</h3>
      )}
    </va-accordion-item>
  );
}

LicenseCertificationSearchResult.propTypes = {
  dispatchFetchLcResult: PropTypes.func.isRequired,
  hasFetchedResult: PropTypes.bool.isRequired,
  result: PropTypes.object.isRequired,
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
