import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import {
  VaPagination,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import {
  TYPEAHEAD_CLICKED,
  TYPEAHEAD_LIST,
  clearGAData,
  getSearchGADataFromStorage,
} from 'platform/site-wide/search-analytics';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { focusElement } from 'platform/utilities/ui';
import { isSearchTermValid } from '~/platform/utilities/search-utilities';

import { fetchSearchResults as retrieveSearchResults } from '../actions';

import Breadcrumbs from '../components/Breadcrumbs';
import Errors from '../components/Errors';
import SearchMaintenance, {
  isWithinMaintenanceWindow,
} from '../components/SearchMaintenance';
import MoreVASearchTools from '../components/MoreVASearchTools';
import RecommendedResults from '../components/RecommendedResults';
import ResultsCounter from '../components/ResultsCounter';
import ResultsList from '../components/ResultsList';

const SCREENREADER_FOCUS_CLASSNAME = 'sr-focus';

const SearchApp = ({
  fetchSearchResults,
  router,
  search,
  searchGovMaintenance,
}) => {
  const userInputFromURL = router?.location?.query?.query || '';
  const pageFromURL = router?.location?.query?.page || undefined;
  const typeaheadUsed = router?.location?.query?.t === 'true' || false;

  const [userInput, setUserInput] = useState(userInputFromURL);
  const [currentResultsQuery, setCurrentResultsQuery] =
    useState(userInputFromURL);
  const [page, setPage] = useState(pageFromURL);
  const [typeAheadWasUsed, setTypeAheadWasUsed] = useState(typeaheadUsed);
  const [formWasSubmitted, setFormWasSubmitted] = useState(false);

  const {
    currentPage,
    errors,
    loading: searchIsLoading,
    perPage,
    results,
    searchesPerformed,
    spellingCorrection,
    totalEntries,
    totalPages,
  } = search;

  const hasErrors = !!(errors && errors.length > 0);

  // When using search bars that are not on /search, or when using the header search
  // we set analytics data into localStorage to contextualize the search
  // This function uses that data to compile GA analytics rather than the data
  // the /search page itself uses
  const compileAnalyticsDataFromStorage = (
    searchAnalyticsLocationData,
    query,
  ) => {
    const typeaheadSuggestionClicked =
      searchAnalyticsLocationData?.[TYPEAHEAD_CLICKED];
    const typeaheadList = searchAnalyticsLocationData?.[TYPEAHEAD_LIST];
    const suggestionsList = typeaheadList
      ? Array?.from(typeaheadList?.split(','))
      : undefined;

    let keywordPosition;
    let keywordSelected;

    if (typeaheadSuggestionClicked) {
      keywordSelected = query;
    }

    if (keywordSelected && suggestionsList?.length) {
      keywordPosition = suggestionsList?.indexOf(query) + 1 || undefined;
    }

    return {
      ...searchAnalyticsLocationData,
      keywordPosition,
      keywordSelected,
      suggestionsList,
      userInput: query,
    };
  };

  // This function compiles GA analytics based on a search that happens in the
  // search bar on the /search page (above the results area)
  const compileAnalyticsDataFromInPageSearch = query => {
    return {
      // Typeahead is disabled, so keywordPosition and keywordSelected will always be undefined
      keywordPosition: undefined,
      keywordSelected: undefined,
      path: document.location.pathname,
      searchLocation: 'Search Results Page',
      searchSelection: 'All VA.gov',
      searchTypeaheadEnabled: false,
      sitewideSearch: true,
      suggestionsList: undefined,
      userInput: query,
    };
  };

  // If there's data in userInput when this component loads,
  // it came from the address bar, so we immediately hit the API
  useEffect(() => {
    const initialUserInput = router?.location?.query?.query || '';
    const searchAnalyticsLocationData = getSearchGADataFromStorage();
    let compiledAnalyticsData = null;

    // If this value is set, we used another app or context to do a site-wide search
    // other than the search functionality on /search
    if (searchAnalyticsLocationData?.path) {
      compiledAnalyticsData = compileAnalyticsDataFromStorage(
        searchAnalyticsLocationData,
        initialUserInput,
      );
    } else {
      compiledAnalyticsData =
        compileAnalyticsDataFromInPageSearch(initialUserInput);
    }

    if (initialUserInput && isSearchTermValid(initialUserInput)) {
      setFormWasSubmitted(true);

      fetchSearchResults(
        initialUserInput,
        page,
        {
          trackEvent: true,
          eventName: 'onload_view_search_results',
          ...compiledAnalyticsData,
        },
        clearGAData,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchesPerformed) {
      focusElement(`.${SCREENREADER_FOCUS_CLASSNAME}`);
    }
  }, [searchIsLoading, searchesPerformed]);

  const updateURL = options => {
    router.push({
      pathname: '',
      query: {
        query: options?.query,
        page: options?.page,
        t: options?.typeaheadUsed || false,
      },
    });
  };

  const updateQueryInfo = options => {
    setCurrentResultsQuery(options?.query);
    setPage(options?.page);
    setTypeAheadWasUsed(options?.typeaheadUsed);
  };

  const handleSearch = clickedPage => {
    const newPage = clickedPage.toString();
    setPage(newPage);
    setFormWasSubmitted(true);

    const rawPageFromURL = pageFromURL ? parseInt(pageFromURL, 10) : undefined;

    if (isSearchTermValid(userInput) || isSearchTermValid(userInputFromURL)) {
      const isRepeatSearch =
        userInputFromURL === userInput && rawPageFromURL === newPage;

      const queryChanged = userInput !== currentResultsQuery;
      const nextPage = queryChanged ? 1 : newPage;

      updateURL({ query: userInput, page: nextPage });

      const compiledAnalyticsData =
        compileAnalyticsDataFromInPageSearch(userInput);

      // Fetch new results
      fetchSearchResults(
        userInput,
        nextPage,
        {
          trackEvent: queryChanged || isRepeatSearch,
          eventName: 'view_search_results',
          ...compiledAnalyticsData,
        },
        clearGAData,
      );

      // Update query is necessary
      if (queryChanged) {
        updateQueryInfo({
          query: userInput,
          page: 1,
          typeaheadUsed: false,
        });
      }
    }
  };

  const onInputSubmit = event => {
    event.preventDefault();
    setFormWasSubmitted(true);
    clearGAData();

    if (!userInput) {
      return;
    }

    const compiledAnalyticsData =
      compileAnalyticsDataFromInPageSearch(userInput);

    if (isSearchTermValid(userInput)) {
      fetchSearchResults(
        userInput,
        1,
        {
          trackEvent: true,
          eventName: 'view_search_results',
          ...compiledAnalyticsData,
        },
        clearGAData,
      );

      updateQueryInfo({
        query: userInput,
        page: 1,
        typeaheadUsed: true,
      });

      updateURL({
        query: userInput,
        page: 1,
        typeaheadUsed: true,
      });
    }
  };

  const handleInputChange = event => {
    if (formWasSubmitted) {
      setFormWasSubmitted(false);
    }

    setUserInput(event.target.value);
  };

  const renderResults = () => {
    return (
      <div>
        <ResultsCounter
          currentPage={currentPage}
          loading={searchIsLoading}
          perPage={perPage}
          query={userInputFromURL}
          results={results}
          spellingCorrection={spellingCorrection}
          totalPages={totalPages}
          totalEntries={totalEntries}
        />
        {!searchIsLoading && (
          <RecommendedResults
            query={userInputFromURL}
            searchData={search}
            typeaheadUsed={typeAheadWasUsed}
          />
        )}
        <ResultsList
          loading={searchIsLoading}
          query={userInputFromURL}
          searchData={search}
          typeaheadUsed={typeAheadWasUsed}
        />
        <hr
          aria-hidden="true"
          id="hr-search-bottom"
          className="vads-u-margin-y--3"
        />
        <div className="vads-u-display--flex vads-u-flex-wrap--wrap results-footer">
          {results && results.length > 0 && (
            <VaPagination
              class="vads-u-border-top--0"
              onPageSelect={e => handleSearch(e.detail.page)}
              page={currentPage}
              pages={totalPages}
              maxPageListLength={7}
            />
          )}
          <span className="powered-by">Powered by Search.gov</span>
        </div>
      </div>
    );
  };

  const shouldShowErrorMessage =
    (hasErrors && !searchIsLoading) ||
    (!isSearchTermValid(userInput) && formWasSubmitted);

  // <SearchMaintenance> creates a maintenance banner for:
  // 1. Search.gov errors during their maintenance windows (Tues & Thurs 3-6pm EST)
  // 2. Sitewide team using the search_gov_maintenance feature flipper
  //    when Search.gov is experiencing major outages
  const shouldShowMaintenanceBanner =
    isWithinMaintenanceWindow() || searchGovMaintenance;

  return (
    <div className="search-app" data-e2e-id="search-app">
      <Breadcrumbs />
      <div className="row">
        <div className="columns">
          <h1 className="vads-u-font-size--2xl" id="h1-search-title">
            Search VA.gov
          </h1>
        </div>
      </div>
      <div className="search-row">
        <div className="usa-width-three-fourths columns">
          <DowntimeNotification
            appTitle="Search App"
            dependencies={[externalServices.search]}
          >
            {
              // Search API is either within the maintenance window AND has returned
              //  no results OR the search_gov_maintenance Flipper has been enabled
              shouldShowMaintenanceBanner && (
                <SearchMaintenance
                  unexpectedMaintenance={searchGovMaintenance}
                />
              )
            }
            {
              // Search API returned errors OR errors with user input before
              //  submitting AND the maintenance banner is NOT going to be displayed
              shouldShowErrorMessage && <Errors userInput={userInput} />
            }
            <div className="vads-u-background-color--gray-lightest vads-u-padding-x--3 vads-u-padding-bottom--3 vads-u-padding-top--1p5 vads-u-margin-bottom--4">
              <p className="vads-u-margin-top--0">
                Enter a keyword, phrase, or question
              </p>
              <div className="va-flex search-box vads-u-margin-top--1 vads-u-margin-bottom--0">
                <VaSearchInput
                  class="vads-u-width--full"
                  disableAnalytics
                  id="search-results-page-dropdown-input-field"
                  data-e2e-id="search-results-page-dropdown-input-field"
                  label="Enter a keyword, phrase, or question"
                  onInput={handleInputChange}
                  onSubmit={event => onInputSubmit(event)}
                  value={userInput}
                />
              </div>
            </div>
            {!shouldShowErrorMessage && renderResults()}
          </DowntimeNotification>
        </div>
        <div className="vads-u-margin-top--3 medium-screen:vads-u-margin-top--0 usa-width-one-fourth columns">
          <h2 className="highlight vads-u-font-size--h4">
            More VA search tools
          </h2>
          <MoreVASearchTools />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  search: state.search,
  searchGovMaintenance:
    toggleValues(state)[FEATURE_FLAG_NAMES.searchGovMaintenance],
});

const mapDispatchToProps = {
  fetchSearchResults: retrieveSearchResults,
};

SearchApp.propTypes = {
  fetchSearchResults: PropTypes.func.isRequired,
  search: PropTypes.shape({
    currentPage: PropTypes.number,
    errors: PropTypes.array,
    loading: PropTypes.bool,
    perPage: PropTypes.number,
    recommendedResults: PropTypes.array,
    results: PropTypes.array,
    searchesPerformed: PropTypes.number,
    spellingCorrection: PropTypes.bool,
    totalEntries: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  router: PropTypes.shape({
    location: PropTypes.shape({
      query: PropTypes.shape({
        page: PropTypes.string,
        query: PropTypes.string,
        t: PropTypes.string,
      }),
    }),
    push: PropTypes.func,
  }),
  searchGovMaintenance: PropTypes.bool,
};

const SearchAppContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchApp),
);

export default SearchAppContainer;
