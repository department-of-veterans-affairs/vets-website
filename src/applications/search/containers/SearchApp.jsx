import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { VaPagination, VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import recordEvent from 'platform/monitoring/record-event';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { focusElement } from 'platform/utilities/ui';
import { apiRequest } from 'platform/utilities/api';

import { isSearchStrInvalid } from '../utils';
import { fetchSearchResults } from '../actions';

import Breadcrumbs from '../components/Breadcrumbs';
import Errors from '../components/Errors';
import MaintenanceWindow, { isWithinMaintenanceWindow } from '../components/MaintenanceWindow';
import MoreVASearchTools from '../components/MoreVASearchTools';
import RecommendedResults from '../components/RecommendedResults';
import ResultsCounter from '../components/ResultsCounter';
import ResultsList from '../components/ResultsList';
import Typeahead from '../components/Typeahead';

const SCREENREADER_FOCUS_CLASSNAME = 'sr-focus';

class SearchApp extends React.Component {
  constructor(props) {
    super(props);

    const userInputFromURL = this.props.router?.location?.query?.query || '';
    const pageFromURL = this.props.router?.location?.query?.page || undefined;
    const typeaheadUsed =
      this.props.router?.location?.query?.t === 'true' || false;

    this.state = {
      userInput: userInputFromURL,
      currentResultsQuery: userInputFromURL,
      page: pageFromURL,
      typeaheadUsed,
      formWasSubmitted: false,
    };
  }

  componentDidMount() {
    // If there's data in userInput, it must have come from the address bar, so we immediately hit the API.
    const { userInput, page } = this.state;
    
    if (userInput) {
      if (isSearchStrInvalid(userInput)) {
        return;
      }

      this.props.fetchSearchResults(userInput, page, {
        trackEvent: true,
        eventName: 'onload_view_search_results',
        path: document.location.pathname,
        userInput,
        typeaheadEnabled: false,
        keywordSelected: undefined,
        keywordPosition: undefined,
        suggestionsList: undefined,
        sitewideSearch: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const hasNewResults =
      prevProps.search.loading && !this.props.search.loading;

    if (hasNewResults) {
      const shouldFocusOnResults = this.props.search.searchesPerformed >= 1;

      if (shouldFocusOnResults) {
        focusElement(`.${SCREENREADER_FOCUS_CLASSNAME}`);
      }
    }
  }

  handlePageChange = page => {
    this.setState({ page }, () => this.handleSearch());
  };

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }

    const { userInput, currentResultsQuery, page } = this.state;

    this.setState({ formWasSubmitted: true });

    const userInputFromURL = this.props.router?.location?.query?.query;
    const rawPageFromURL = this.props.router?.location?.query?.page;
    const pageFromURL = rawPageFromURL
      ? parseInt(rawPageFromURL, 10)
      : undefined;

    if (isSearchStrInvalid(userInput) || isSearchStrInvalid(userInputFromURL)) {
      return;
    }

    const repeatSearch = userInputFromURL === userInput && pageFromURL === page;

    const queryChanged = userInput !== currentResultsQuery;
    const nextPage = queryChanged ? 1 : page;

    this.updateURL({ query: userInput, page: nextPage });

    // Fetch new results
    this.props.fetchSearchResults(userInput, nextPage, {
      trackEvent: queryChanged || repeatSearch,
      eventName: 'view_search_results',
      path: document.location.pathname,
      userInput,
      typeaheadEnabled: false,
      searchLocation: 'Search Results Page',
      keywordSelected: undefined,
      keywordPosition: undefined,
      suggestionsList: undefined,
      sitewideSearch: false,
    });

    // Update query is necessary
    if (queryChanged) {
      this.updateQueryInfo({ query: userInput, page: 1, typeaheadUsed: false });
    }
  };

  updateQueryInfo = options => {
    this.setState({
      currentResultsQuery: options?.query,
      page: options?.page,
      typeaheadUsed: options?.typeaheadUsed,
    });
  };

  updateURL = options => {
    // Update URL
    this.props.router.push({
      pathname: '',
      query: {
        query: options?.query,
        page: options?.page,
        t: options?.typeaheadUsed || false,
      },
    });
  };

  onInputSubmit = componentState => {
    const savedSuggestions = componentState?.savedSuggestions || [];
    const suggestions = componentState?.suggestions || [];
    const inputValue = componentState?.inputValue;
    const validSuggestions =
      savedSuggestions.length > 0 ? savedSuggestions : suggestions;

    if (isSearchStrInvalid(inputValue)) {
      return;
    }

    this.props.fetchSearchResults(inputValue, 1, {
      trackEvent: true,
      eventName: 'view_search_results',
      path: document.location.pathname,
      userInput: inputValue,
      typeaheadEnabled: true,
      searchLocation: 'Search Results Page',
      keywordSelected: undefined,
      keywordPosition: undefined,
      suggestionsList: validSuggestions,
      sitewideSearch: false,
    });

    this.updateQueryInfo({
      query: inputValue,
      page: 1,
      typeaheadUsed: true,
    });

    this.updateURL({
      query: inputValue,
      page: 1,
      typeaheadUsed: true,
    });

    this.setState({
      userInput: inputValue,
    });
  };

  onSuggestionSubmit = (index, componentState) => {
    const savedSuggestions = componentState?.savedSuggestions || [];
    const suggestions = componentState?.suggestions || [];
    const inputValue = componentState?.inputValue;

    const validSuggestions =
      savedSuggestions?.length > 0 ? savedSuggestions : suggestions;

    this.props.fetchSearchResults(validSuggestions[index], 1, {
      trackEvent: true,
      eventName: 'view_search_results',
      path: document.location.pathname,
      userInput: inputValue,
      typeaheadEnabled: true,
      searchLocation: 'Search Results Page',
      keywordSelected: validSuggestions[index],
      keywordPosition: index + 1,
      suggestionsList: validSuggestions,
      sitewideSearch: false,
    });

    this.updateQueryInfo({
      query: suggestions[index],
      page: 1,
      typeaheadUsed: true,
    });

    this.updateURL({
      query: suggestions[index],
      page: 1,
      typeaheadUsed: true,
    });

    this.setState({
      userInput: inputValue,
    });
  };

  fetchSuggestions = async inputValue => {
    // encode user input for query to suggestions url
    const encodedInput = encodeURIComponent(inputValue);

    // fetch suggestions
    try {
      if (isSearchStrInvalid(inputValue)) {
        return [];
      }

      const apiRequestOptions = {
        method: 'GET',
      };
      const fetchedSuggestions = await apiRequest(
        `/search_typeahead?query=${encodedInput}`,
        apiRequestOptions,
      );

      if (fetchedSuggestions.length !== 0) {
        return fetchedSuggestions.sort(function(a, b) {
          return a.length - b.length;
        });
      }
      return [];
      // if we fail to fetch suggestions
    } catch (error) {
      if (error?.error?.code === 'OVER_RATE_LIMIT') {
        Sentry.captureException(
          new Error(`"OVER_RATE_LIMIT" - Search Typeahead`),
        );
      }
      Sentry.captureException(error);
    }
    return [];
  };

  handleInputChange = e => {
    this.setState({
      userInput: e.target.value,
    });

    if (this.state.formWasSubmitted) {
      this.setState({ formWasSubmitted: false });
    }
  };

  fetchInputValue = input => {
    this.setState({
      userInput: input,
    });
  };

  renderResults() {
    const {
      loading,
      errors,
      currentPage,
      perPage,
      recommendedResults,
      results,
      spellingCorrection,
      totalEntries,
      totalPages,
    } = this.props.search;

    const hasErrors = !!(errors && errors.length > 0);
    const { userInput } = this.state;

    // Reusable search input
    const searchInput = (
      <div className="vads-u-background-color--gray-lightest vads-u-padding-x--3 vads-u-padding-bottom--3 vads-u-padding-top--1p5 vads-u-margin-top--1p5 vads-u-margin-bottom--4">
        <p className="vads-u-margin-top--0">
          Enter a keyword, phrase, or question
        </p>
        <div className="va-flex search-box vads-u-margin-top--1 vads-u-margin-bottom--0">
          {!this.props.searchDropdownComponentEnabled && (
            <VaSearchInput
              aria-labelledby="h1-search-title"
              submitButtonText="Search"
              className="vads-u-width--full"
              label="Enter a keyword, phrase, or question"
              onInput={this.handleInputChange}
              onSubmit={this.handleSearch}
              uswds
              value={userInput}
            />
          )}
          {this.props.searchDropdownComponentEnabled && (
            <Typeahead
              id="search-results-page-dropdown"
              fetchInputValue={this.fetchInputValue}
              fetchSuggestions={this.fetchSuggestions}
              onInputSubmit={this.onInputSubmit}
              onSuggestionSubmit={this.onSuggestionSubmit}
              startingValue={userInput}
            />
          )}
        </div>
      </div>
    );

    if (
      isWithinMaintenanceWindow() &&
      results &&
      results.length === 0 &&
      !hasErrors &&
      !loading
    ) {
      return <MaintenanceWindow searchInput={searchInput} />;
    }

    // Failed call to Search.gov (successful vets-api response) AND Failed call to vets-api endpoint
    // or errors with user input before submitting
    if ((hasErrors && !loading) || (isSearchStrInvalid(userInput) && this.state.formWasSubmitted)) {
      return <Errors userInput={userInput} searchInput={searchInput} />;
    }

    const query = this.props.router?.location?.query?.query || '';

    return (
      <div>
        {searchInput}
        <ResultsCounter
          currentPage={currentPage}
          loading={loading}
          perPage={perPage}
          query={query}
          results={results}
          spellingCorrection={spellingCorrection}
          totalPages={totalPages}
          totalEntries={totalEntries}
        />
        {/* <RecommendedResults 
          loading={loading}
          recommendedResults={recommendedResults}
        /> */}
        {/* <ResultsList results={results} /> */}
        <hr
          aria-hidden="true"
          id="hr-search-bottom"
          className="vads-u-margin-y--3"
        />
        <div className="va-flex results-footer">
          {results &&
            results.length > 0 && (
              <VaPagination
                onPageSelect={e => this.handlePageChange(e.detail.page)}
                page={currentPage}
                pages={totalPages}
                maxPageListLength={7}
                uswds
              />
            )}
          <span className="powered-by">Powered by Search.gov</span>
        </div>
      </div>
    );
  }

  render() {
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
              {this.renderResults()}
            </DowntimeNotification>
          </div>
          <div className="usa-width-one-fourth columns">
            <h2 className="highlight vads-u-font-size--h4">
              More VA search tools
            </h2>
            <MoreVASearchTools />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.search,
  searchDropdownComponentEnabled: toggleValues(state)[
    FEATURE_FLAG_NAMES.searchDropdownComponentEnabled
  ],
});

const mapDispatchToProps = {
  fetchSearchResults,
};

SearchApp.propTypes = {
  fetchSearchResults: PropTypes.func.isRequired,
  router: PropTypes.shape({
    location: PropTypes.shape({
      query: PropTypes.shape({
        page: PropTypes.string,
        query: PropTypes.string,
        t: PropTypes.string
      })
    }),
    push: PropTypes.func,
  }),
  search: PropTypes.shape({
    currentPage: PropTypes.number,
    errors: PropTypes.array,
    loading: PropTypes.bool,
    perPage: PropTypes.number,
    recommendedResults: PropTypes.array,
    results: PropTypes.array,
    spellingCorrection: PropTypes.bool,
    totalEntries: PropTypes.number,
    totalPages: PropTypes.number
  }).isRequired,
  searchDropdownComponentEnabled: PropTypes.bool
};

const SearchAppContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SearchApp),
);

export default SearchAppContainer;

SearchAppContainer.defaultProps = {
  searchDropdownComponentEnabled: false,
};
 