import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  fetchSearchByLocationResults,
  fetchSearchByNameResults,
  setPageTitle,
} from '../actions';
import { PAGE_TITLE } from '../constants';
import SearchForm from '../components/SearchForm';

export function LandingPage({
  search,
  dispatchSetPageTitle,
  dispatchFetchSearchByLocationResults,
  dispatchFetchSearchByNameResults,
}) {
  useEffect(() => {
    dispatchSetPageTitle(`${PAGE_TITLE}: VA.gov`);
  }, []);
  return (
    <span className="landing-page">
      <div className="vads-u-min-height--viewport row">
        <div className="column">
          <div className="vads-u-text-align--center">
            <h1>GI Bill® Comparison Tool</h1>
            <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
              Use the GI Bill Comparison Tool to see how VA education benefits
              can pay for your education.
            </p>
          </div>
          <SearchForm
            search={search}
            fetchSearchByLocation={dispatchFetchSearchByLocationResults}
            fetchSearchByName={dispatchFetchSearchByNameResults}
          />
        </div>
        <div className="small-12 usa-width-one-third medium-4 columns" />
      </div>
    </span>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  eligibility: state.eligibility,
  search: state.search,
});

const mapDispatchToProps = {
  dispatchSetPageTitle: setPageTitle,
  dispatchFetchSearchByLocationResults: fetchSearchByLocationResults,
  dispatchFetchSearchByNameResults: fetchSearchByNameResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);
