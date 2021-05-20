import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { setPageTitle, changeSearchTab } from '../actions';
import { PAGE_TITLE } from '../constants';
import SearchResults from '../components/SearchResults';
import SearchTabs from '../components/search/SearchTabs';
import { useQueryParams } from '../utils/helpers';
import { useHistory } from 'react-router-dom';

export function LandingPage({
  search,
  dispatchSetPageTitle,
  dispatchChangeSearchTab,
}) {
  useEffect(() => {
    dispatchSetPageTitle(`${PAGE_TITLE}: VA.gov`);
  }, []);
  const queryParams = useQueryParams();
  const history = useHistory();

  const tabChange = tab => {
    dispatchChangeSearchTab(tab);

    queryParams.set('search', tab);
    history.push({ pathname: '/', search: queryParams.toString() });
  };

  return (
    <span className="landing-page">
      <div className="vads-u-min-height--viewport row">
        <div className="column vads-u-padding-bottom--2">
          <div className="vads-u-text-align--center">
            <h1>GI Bill® Comparison Tool</h1>
            <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
              Use the GI Bill Comparison Tool to see how VA education benefits
              can pay for your education.
            </p>
          </div>
          <SearchTabs onChange={tabChange} tab={search.tab} />
        </div>
        <div>
          <SearchResults search={search} />
        </div>
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
  dispatchChangeSearchTab: changeSearchTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);
