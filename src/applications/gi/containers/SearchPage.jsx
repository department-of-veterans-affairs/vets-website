/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import SearchTabs from '../components/search/SearchTabs';
import { TABS } from '../constants';
import NameSearchResults from './search/NameSearchResults';
import LocationSearchResults from './search/LocationSearchResults';
import { isSmallScreen } from '../utils/helpers';
import NameSearchForm from './search/NameSearchForm';
import LocationSearchForm from './search/LocationSearchForm';
import AccordionItem from '../components/AccordionItem';
import { getSearchQueryChanged, updateUrlParams } from '../selectors/search';
import GIBillHeaderInfo from '../components/GIBillHeaderInfo';
import { changeSearchTab, setError } from '../actions';

export function SearchPage({
  dispatchChangeSearchTab,
  search,
  preview,
  filters,
  dispatchError,
}) {
  const isLandscape = () => {
    const islandscape = matchMedia('(orientation: landscape)');
    const mobileDevice = matchMedia(
      '(min-device-width: 320px) and (max-device-width: 844px) and (-webkit-min-device-pixel-ratio: 2)',
    );
    if (islandscape.matches === true && mobileDevice.matches === true)
      return true;
    return false;
  };
  const history = useHistory();
  const { tab, error, query } = search;
  const [smallScreen, setSmallScreen] = useState(isSmallScreen());
  const [landscape, setLandscape] = useState(isLandscape());
  const [accordions, setAccordions] = useState({
    [TABS.name]: tab === TABS.name,
    [TABS.location]: tab === TABS.location,
  });
  const { version } = preview;

  useEffect(() => {
    const checkSize = () => {
      setSmallScreen(isSmallScreen());
      setLandscape(isLandscape());
    };

    window.addEventListener('resize', checkSize);

    if (getSearchQueryChanged(search.query)) {
      updateUrlParams(history, search.tab, search.query, filters, version);
    }

    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const tabbedResults = {
    [TABS.name]: <NameSearchResults smallScreen={smallScreen} />,
    [TABS.location]: (
      <LocationSearchResults smallScreen={smallScreen} landscape={landscape} />
    ),
  };

  const tabChange = selectedTab => {
    recordEvent({
      event: 'nav-tab-click',
      'tab-text': `Search by ${selectedTab}`,
    });
    dispatchChangeSearchTab(selectedTab);
    updateUrlParams(history, selectedTab, search.query, filters, version);
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
    <>
      <GIBillHeaderInfo />
      <span className="search-page">
        <div className={searchPageClasses}>
          <div className="column medium-screen:vads-u-padding-bottom--2 small-screen:vads-u-padding-bottom--0 vads-u-padding-x--0">
            {!smallScreen && (
              <SearchTabs
                onChange={tabChange}
                search={search}
                dispatchError={dispatchError}
              />
            )}
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
                    onClick={expanded => {
                      accordionChange(TABS.name, expanded);
                    }}
                  >
                    <NameSearchForm smallScreen />
                  </AccordionItem>
                  <AccordionItem
                    button="Search by location"
                    expanded={accordions[TABS.location]}
                    onClick={expanded => {
                      accordionChange(TABS.location, expanded);
                    }}
                  >
                    <LocationSearchForm smallScreen />
                  </AccordionItem>
                  {!error && smallScreen && tabbedResults[tab]}
                </div>
              )}
          </div>
        </div>
      </span>
    </>
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
  dispatchError: setError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
