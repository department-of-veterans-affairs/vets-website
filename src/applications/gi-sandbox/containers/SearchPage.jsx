import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { changeSearchTab, setPageTitle } from '../actions';
import { PAGE_TITLE, TABS } from '../constants';
import SearchTabs from '../components/search/SearchTabs';
import { useQueryParams } from '../utils/helpers';
import { useHistory } from 'react-router-dom';
import CompareDrawer from './CompareDrawer';
import NameSearchResults from '../containers/search/NameSearchResults';
import LocationSearchResults from '../containers/search/LocationSearchResults';

export function SearchPage({
  dispatchChangeSearchTab,
  dispatchSetPageTitle,
  search,
}) {
  useEffect(() => {
    dispatchSetPageTitle(`${PAGE_TITLE}: VA.gov`);
  }, []);
  const queryParams = useQueryParams();
  const history = useHistory();
  const { tab, error } = search;

  const tabbedResults = {
    [TABS.name]: <NameSearchResults />,
    [TABS.location]: <LocationSearchResults />,
  };

  const tabChange = selectedTab => {
    dispatchChangeSearchTab(selectedTab);

    queryParams.set('search', selectedTab);
    history.push({ pathname: '/', search: queryParams.toString() });
  };

  return (
    <span className="landing-page">
      <div className="vads-u-min-height--viewport row">
        <div className="column vads-u-padding-bottom--2 vads-u-padding-x--0">
          <SearchTabs onChange={tabChange} search={search} />
          {!error && tabbedResults[tab]}
          {error && (
            <div className="vads-u-padding-top--2">
              <va-alert onClose={function noRefCheck() {}} status="warning">
                <h3 slot="headline">
                  The GI Bill Comparison Tool isn’t working right now
                </h3>
                <div>
                  We’re sorry. Something went wrong on our end. Please refresh
                  this page or try searching again.
                </div>
              </va-alert>
            </div>
          )}
        </div>
      </div>
      <CompareDrawer />
    </span>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  eligibility: state.eligibility,
  search: state.search,
});

const mapDispatchToProps = {
  dispatchChangeSearchTab: changeSearchTab,
  dispatchSetPageTitle: setPageTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
