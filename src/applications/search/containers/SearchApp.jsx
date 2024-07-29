import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { focusElement } from 'platform/utilities/ui';
import { isSearchTermValid } from '~/platform/utilities/search-utilities';

import { fetchSearchResults as retrieveSearchResults} from '../actions';

import Breadcrumbs from '../components/Breadcrumbs';
import Errors from '../components/Errors';
import MaintenanceWindow, {
  isWithinMaintenanceWindow,
} from '../components/MaintenanceWindow';
import MoreVASearchTools from '../components/MoreVASearchTools';
import RecommendedResults from '../components/RecommendedResults';
import ResultsCounter from '../components/ResultsCounter';
import ResultsList from '../components/ResultsList';
import Typeahead from '../components/Typeahead';

const SCREENREADER_FOCUS_CLASSNAME = 'sr-focus';

const SearchApp = ({
  fetchSearchResults,
  router,
  search,
  searchGovMaintenance
}) => {
  const userInputFromURL = router?.location?.query?.query || '';
  const pageFromURL = router?.location?.query?.page || undefined;
  const typeaheadUsed =
    router?.location?.query?.t === 'true' || false;

  const [userInput, setUserInput] = useState(userInputFromURL);
  const [savedSuggestions, setSavedSuggestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currentResultsQuery, setCurrentResultsQuery] = useState(userInputFromURL);
  const [page, setPage] = useState(pageFromURL);
  const [typeAheadWasUsed, setTypeAheadWasUsed] = useState(typeaheadUsed);
  const [formWasSubmitted, setFormWasSubmitted] = useState(true);

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

  // If there's data in userInput, it must have come from the address bar, so we immediately hit the API.
  useEffect(() => {
    if (userInput && isSearchTermValid(userInput)) {
      fetchSearchResults(userInput, page, {
        trackEvent: true,
        eventName: 'onload_view_search_results',
        path: document.location.pathname,
        userInput,
        keywordSelected: undefined,
        keywordPosition: undefined,
        suggestionsList: undefined,
        sitewideSearch: false,
      });
    }
  }, [fetchSearchResults, page, userInput]);

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

  const handleSearch = event => {
    if (event) {
      event.preventDefault();
    }

    setFormWasSubmitted(true);

    const rawPageFromURL = pageFromURL
      ? parseInt(pageFromURL, 10)
      : undefined;

    if (isSearchTermValid(userInput) || isSearchTermValid(userInputFromURL)) {
      const isRepeatSearch =
        userInputFromURL === userInput && rawPageFromURL === page;

      const queryChanged = userInput !== currentResultsQuery;
      const nextPage = queryChanged ? 1 : page;
      
      updateURL({ query: userInput, page: nextPage });

      // Fetch new results
      fetchSearchResults(userInput, nextPage, {
        trackEvent: queryChanged || isRepeatSearch,
        eventName: 'view_search_results',
        path: document.location.pathname,
        userInput,
        searchLocation: 'Search Results Page',
        keywordSelected: undefined,
        keywordPosition: undefined,
        suggestionsList: undefined,
        sitewideSearch: false,
      });

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

  const handlePageChange = newPage => {
    setPage(newPage);
    handleSearch();
  };

  const onInputSubmit = () => {
    const validSuggestions =
      savedSuggestions.length > 0 ? savedSuggestions : suggestions;

    if (isSearchTermValid(userInput)) {
      fetchSearchResults(userInput, 1, {
        trackEvent: true,
        eventName: 'view_search_results',
        path: document.location.pathname,
        userInput,
        searchLocation: 'Search Results Page',
        keywordSelected: undefined,
        keywordPosition: undefined,
        suggestionsList: validSuggestions,
        sitewideSearch: false,
      });

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

      setUserInput(userInput);
    }
  };

  const renderResults = () => {
    const hasErrors = !!(errors && errors.length > 0);

    const searchInput = (
      <div className="vads-u-background-color--gray-lightest vads-u-padding-x--3 vads-u-padding-bottom--3 vads-u-padding-top--1p5 vads-u-margin-top--1p5 vads-u-margin-bottom--4">
        <p className="vads-u-margin-top--0">
          Enter a keyword, phrase, or question
        </p>
        <div className="va-flex search-box vads-u-margin-top--1 vads-u-margin-bottom--0">
          <Typeahead
            formWasSubmitted={formWasSubmitted}
            id="search-results-page-dropdown"
            onInputSubmit={onInputSubmit}
            setFormWasSubmitted={setFormWasSubmitted}
            setSavedSuggestions={setSavedSuggestions}
            setSuggestions={setSuggestions}
            setUserInput={setUserInput}
            userInput={userInput}
          />
        </div>
      </div>
    );

    const searchGovIssuesWithinMaintenanceWindow =
      isWithinMaintenanceWindow() &&
      results &&
      results.length === 0 &&
      !hasErrors &&
      !searchIsLoading;

    const searchGovIssuesOutsideMaintenanceWindow = searchGovMaintenance;

    if (
      searchGovIssuesWithinMaintenanceWindow ||
      searchGovIssuesOutsideMaintenanceWindow
    ) {
      return <MaintenanceWindow searchInput={searchInput} />;
    }

    // Failed call to Search.gov (successful vets-api response) AND Failed call to vets-api endpoint
    // or errors with user input before submitting
    if (
      (hasErrors && !searchIsLoading) ||
      (!isSearchTermValid(userInput) && formWasSubmitted)
    ) {
      return <Errors userInput={userInput} searchInput={searchInput} />;
    }

    return (
      <div>
        {searchInput}
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
        <div className="va-flex results-footer">
          {results &&
            results.length > 0 && (
              <VaPagination
                class="vads-u-border-top--0"
                onPageSelect={e => handlePageChange(e.detail.page)}
                page={currentPage}
                pages={totalPages}
                maxPageListLength={7}
              />
            )}
          <span className="powered-by">Powered by Search.gov</span>
        </div>
      </div>
    );
  }

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
            {renderResults()}
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
  searchGovMaintenance: toggleValues(state)[
    FEATURE_FLAG_NAMES.searchGovMaintenance
  ],
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SearchApp),
);

export default SearchAppContainer;
