import React, { Component } from 'react';
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
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { focusElement } from 'platform/utilities/ui';
import { isSearchTermValid } from '~/platform/utilities/search-utilities';

import { fetchSearchResults } from '../actions';

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

class SearchApp extends Component {
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
      formWasSubmitted: true,
    };
  }

  componentDidMount() {
    // If there's data in userInput, it must have come from the address bar, so we immediately hit the API.
    const { userInput, page } = this.state;

    if (userInput && isSearchTermValid(userInput)) {
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

    if (isSearchTermValid(userInput) || isSearchTermValid(userInputFromURL)) {
      const repeatSearch =
        userInputFromURL === userInput && pageFromURL === page;

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
        this.updateQueryInfo({
          query: userInput,
          page: 1,
          typeaheadUsed: false,
        });
      }
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

    if (isSearchTermValid(inputValue)) {
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
    }
  };

  handleInputChange = e => {
    this.setState({
      userInput: e.target.value,
    });

    if (this.state.formWasSubmitted) {
      this.setState({ formWasSubmitted: false });
    }
  };

  renderResults() {
    const {
      loading,
      errors,
      currentPage,
      perPage,
      results,
      spellingCorrection,
      totalEntries,
      totalPages,
    } = this.props.search;

    const { searchGovMaintenance } = this.props;
    const hasErrors = !!(errors && errors.length > 0);
    const { userInput } = this.state;

    const searchInput = (
      <div className="vads-u-background-color--gray-lightest vads-u-padding-x--3 vads-u-padding-bottom--3 vads-u-padding-top--1p5 vads-u-margin-top--1p5 vads-u-margin-bottom--4">
        <p className="vads-u-margin-top--0">
          Enter a keyword, phrase, or question
        </p>
        <div className="va-flex search-box vads-u-margin-top--1 vads-u-margin-bottom--0">
          {!this.props.searchDropdownComponentEnabled && (
            <VaSearchInput
              aria-labelledby="h1-search-title"
              buttonText="Search"
              className="vads-u-width--full"
              label="Enter a keyword, phrase, or question"
              onInput={this.handleInputChange}
              onSubmit={this.handleSearch}
              value={userInput}
            />
          )}
          {this.props.searchDropdownComponentEnabled && (
            <Typeahead
              id="search-results-page-dropdown"
              onInputSubmit={this.onInputSubmit}
              startingValue={userInput}
            />
          )}
        </div>
      </div>
    );

    const searchGovIssuesWithinMaintenanceWindow =
      isWithinMaintenanceWindow() &&
      results &&
      results.length === 0 &&
      !hasErrors &&
      !loading;

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
      (hasErrors && !loading) ||
      (!isSearchTermValid(userInput) && this.state.formWasSubmitted)
    ) {
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
        {!loading && (
          <RecommendedResults
            query={query}
            searchData={this.props.search}
            typeaheadUsed={this.state.typeaheadUsed}
          />
        )}
        <ResultsList
          loading={loading}
          query={query}
          searchData={this.props.search}
          typeaheadUsed={this.state.typeaheadUsed}
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
                onPageSelect={e => this.handlePageChange(e.detail.page)}
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
          <div className="vads-u-margin-top--3 medium-screen:vads-u-margin-top--0 usa-width-one-fourth columns">
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
  searchGovMaintenance: toggleValues(state)[
    FEATURE_FLAG_NAMES.searchGovMaintenance
  ],
});

const mapDispatchToProps = {
  fetchSearchResults,
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
  searchDropdownComponentEnabled: PropTypes.bool,
  searchGovMaintenance: PropTypes.bool,
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
