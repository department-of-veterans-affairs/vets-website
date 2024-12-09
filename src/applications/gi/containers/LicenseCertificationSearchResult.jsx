import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchLcResult } from '../actions';

function LicenseCertificationSearchResult() {
  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <h1> Name</h1>
        <div>Tab view for results</div>
      </section>
    </div>
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
