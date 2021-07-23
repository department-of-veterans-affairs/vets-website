import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { changeSearchTab, setPageTitle } from '../actions';
import { PAGE_TITLE, TABS } from '../constants';
import SearchTabs from '../components/search/SearchTabs';
import { useQueryParams } from '../utils/helpers';
import { useHistory } from 'react-router-dom';
import CompareDrawer from './CompareDrawer';
import NameSearchResults from '../containers/search/NameSearchResults';
import LocationSearchResults from '../containers/search/LocationSearchResults';
import NameSearchForm from './search/NameSearchForm';
import LocationSearchForm from './search/LocationSearchForm';
import AccordionItem from '../components/AccordionItem';

export function SearchPage({
  dispatchChangeSearchTab,
  dispatchSetPageTitle,
  search,
}) {
  const queryParams = useQueryParams();
  const history = useHistory();
  const { tab, error } = search;
  const [smallScreen, setSmallScreen] = useState(
    matchMedia('(max-width: 480px)').matches,
  );
  const [accordions, setAccordions] = useState({
    [TABS.name]: true,
    [TABS.location]: false,
  });

  useEffect(
    () => {
      dispatchSetPageTitle(`${PAGE_TITLE}: VA.gov`);
    },
    [dispatchSetPageTitle],
  );

  useEffect(() => {
    const checkSize = () => {
      setSmallScreen(matchMedia('(max-width: 480px)').matches);
    };
    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const tabbedResults = {
    [TABS.name]: <NameSearchResults />,
    [TABS.location]: <LocationSearchResults />,
  };

  const tabChange = selectedTab => {
    dispatchChangeSearchTab(selectedTab);
    queryParams.set('search', selectedTab);
    history.push({ pathname: '/', search: queryParams.toString() });
  };

  const accordionChange = (selectedAccordion, expanded) => {
    let updated = {
      ...accordions,
      [selectedAccordion]: expanded,
    };
    if (selectedAccordion === TABS.name && expanded) {
      updated = { ...updated, [TABS.location]: false };
    } else if (selectedAccordion === TABS.location && expanded) {
      updated = { ...updated, [TABS.name]: false };
    }

    setAccordions(updated);
  };

  return (
    <span className="search-page">
      <div className="vads-u-min-height--viewport row">
        <div className="column vads-u-padding-bottom--2 vads-u-padding-x--0">
          {!smallScreen && <SearchTabs onChange={tabChange} search={search} />}
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
          {!error && !smallScreen && tabbedResults[tab]}
          {smallScreen && (
            <div>
              <AccordionItem
                button="Search by name"
                expanded={accordions[TABS.name]}
                onClick={expanded => accordionChange(TABS.name, expanded)}
              >
                <NameSearchForm />
              </AccordionItem>
              <AccordionItem
                button="Search by location"
                expanded={accordions[TABS.location]}
                onClick={expanded => accordionChange(TABS.location, expanded)}
              >
                <LocationSearchForm />
              </AccordionItem>
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
