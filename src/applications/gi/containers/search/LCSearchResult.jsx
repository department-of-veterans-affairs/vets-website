import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LCResultInfo from './LCResultInfo';
import { fetchLcResult } from '../../actions';

function LCSearchResult({ result, hasFetchedResult, dispatchFetchLcResult }) {
  const { name, type } = result;

  const handleClick = () => {
    dispatchFetchLcResult();
  };

  return (
    <va-accordion-item
      id={name}
      header={name}
      subheader={type}
      onClick={() => handleClick()}
    >
      {hasFetchedResult ? <LCResultInfo /> : <h3>Loading</h3>}
    </va-accordion-item>
  );
}

LCSearchResult.propTypes = {
  dispatchFetchLcResult: PropTypes.func.isRequired,
  hasFetchedResult: PropTypes.bool.isRequired,
  result: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  hasFetchedResult: state.licenseCertificationSearch.hasFetchedResult,
});

const mapDispatchToProps = {
  dispatchFetchLcResult: fetchLcResult,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LCSearchResult);
