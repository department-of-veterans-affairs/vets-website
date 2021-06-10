import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { setPageTitle, changeSearchTab } from '../actions';
import { PAGE_TITLE, TABS } from '../constants';
import SearchTabs from '../components/search/SearchTabs';
import { useQueryParams } from '../utils/helpers';
import { useHistory } from 'react-router-dom';
import CompareDrawer from './CompareDrawer';
import NameResults from '../components/search/NameResults';
import LocationSearchResults from '../components/search/LocationSearchResults';

export function SearchPage({
  search,
  dispatchSetPageTitle,
  dispatchChangeSearchTab,
}) {
  useEffect(() => {
    dispatchSetPageTitle(`${PAGE_TITLE}: VA.gov`);
  }, []);
  const queryParams = useQueryParams();
  const history = useHistory();
  const { tab } = search;

  const tabbedResults = {
    [TABS.name]: <NameResults search={search} />,
    [TABS.location]: <LocationSearchResults search={search} />,
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
          {tabbedResults[tab]}
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
  dispatchSetPageTitle: setPageTitle,
  dispatchChangeSearchTab: changeSearchTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
