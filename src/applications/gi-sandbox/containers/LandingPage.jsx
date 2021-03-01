import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { setPageTitle } from '../actions';
import { PAGE_TITLE } from '../constants';
import SearchSchools from '../containers/SearchSchools';

export function LandingPage({ dispatchSetPageTitle }) {
  useEffect(() => {
    dispatchSetPageTitle(`${PAGE_TITLE}: VA.gov`);
  }, []);
  return (
    <span className="landing-page">
      <div className="vads-u-min-height--viewport row">
        <div className="column">
          <h1>GI Bill® CT Redesign Sandbox</h1>
          <p className="vads-u-font-family--sans vads-u-font-size--h3 vads-u-color--gray-dark">
            Learn about education programs and compare benefits by school.
          </p>
          <SearchSchools />
        </div>
        <div className="small-12 usa-width-one-third medium-4 columns" />
      </div>
    </span>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  eligibility: state.eligibility,
});

const mapDispatchToProps = {
  dispatchSetPageTitle: setPageTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);
