import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { changeSearchTab, setPageTitle } from '../actions';
import { PAGE_TITLE, TABS } from '../constants';
import SearchTabs from '../components/search/SearchTabs';
import { updateUrlParams, useQueryParams } from '../utils/helpers';
import { useHistory } from 'react-router-dom';
import NameSearchResults from '../containers/search/NameSearchResults';
import LocationSearchResults from '../containers/search/LocationSearchResults';
import NameSearchForm from './search/NameSearchForm';
import LocationSearchForm from './search/LocationSearchForm';
import AccordionItem from '../components/AccordionItem';
import { getSearchQueryChanged } from '../selectors/search';
import classNames from 'classnames';
import GIBillHeaderInfo from '../components/GIBillHeaderInfo';

export function SearchPage({
  dispatchChangeSearchTab,
  dispatchSetPageTitle,
  search,
  preview,
  filters,
}) {
  const queryParams = useQueryParams();
  const history = useHistory();
  const { tab, error, query } = search;
  const [smallScreen, setSmallScreen] = useState(
    matchMedia('(max-width: 480px)').matches,
  );
  const [accordions, setAccordions] = useState({
    [TABS.name]: tab === TABS.name,
    [TABS.location]: tab === TABS.location,
  });
  const { version } = preview;

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

    if (getSearchQueryChanged(search.query)) {
      updateUrlParams(history, search.tab, search.query, filters, version, 1);
    }

    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const tabbedResults = {
    [TABS.name]: <NameSearchResults smallScreen={smallScreen} />,
    [TABS.location]: <LocationSearchResults smallScreen={smallScreen} />,
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
    tabChange(selectedAccordion);
  };

  const searchPageClasses = classNames('row', {
    'no-name-results':
      tab === TABS.name && (query.name === '' || query.name === null),
  });

  return (
    <span className="search-page">
      <div className={searchPageClasses}>
        <GIBillHeaderInfo />
        <div className="column medium-screen:vads-u-padding-bottom--2 small-screen:vads-u-padding-bottom--0 vads-u-padding-x--0">
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
          {!error &&
            smallScreen && (
              <div>
                <AccordionItem
                  button="Search by name"
                  expanded={accordions[TABS.name]}
                  onClick={expanded => accordionChange(TABS.name, expanded)}
                >
                  <NameSearchForm smallScreen />
                </AccordionItem>
                <AccordionItem
                  button="Search by location"
                  expanded={accordions[TABS.location]}
                  onClick={expanded => accordionChange(TABS.location, expanded)}
                >
                  <LocationSearchForm smallScreen />
                </AccordionItem>

                {!error && smallScreen && tabbedResults[tab]}
              </div>
            )}
        </div>
      </div>
    </span>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  eligibility: state.eligibility,
  search: state.search,
  preview: state.preview,
  filters: state.filters,
});

const mapDispatchToProps = {
  dispatchChangeSearchTab: changeSearchTab,
  dispatchSetPageTitle: setPageTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
