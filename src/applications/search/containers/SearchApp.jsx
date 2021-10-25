import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import IconSearch from '@department-of-veterans-affairs/component-library/IconSearch';

import { fetchSearchResults } from '../actions';
import {
  formatResponseString,
  truncateResponseString,
  removeDoubleBars,
} from '../utils';
import recordEvent from 'platform/monitoring/record-event';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';

import { focusElement } from 'platform/utilities/ui';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';

import SearchBreadcrumbs from '../components/SearchBreadcrumbs';
import SearchDropdownComponent from '../components/SearchDropdown/SearchDropdownComponent';

const SCREENREADER_FOCUS_CLASSNAME = 'sr-focus';
const MAX_DESCRIPTION_LENGTH = 186;

class SearchApp extends React.Component {
  static propTypes = {
    search: PropTypes.shape({
      results: PropTypes.array,
    }).isRequired,
    fetchSearchResults: PropTypes.func.isRequired,
  };

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
    };
  }

  componentDidMount() {
    // If there's data in userInput, it must have come from the address bar, so we immediately hit the API.
    const { userInput, page } = this.state;
    if (userInput) {
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
    if (e) e.preventDefault();
    const { userInput, currentResultsQuery, page } = this.state;

    const userInputFromURL = this.props.router?.location?.query?.query;
    const rawPageFromURL = this.props.router?.location?.query?.page;
    const pageFromURL = rawPageFromURL
      ? parseInt(rawPageFromURL, 10)
      : undefined;

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

  onSearchResultClick = ({ bestBet, title, index, url }) => async e => {
    e.preventDefault();

    // clear the &t query param which is used to track typeahead searches
    // removing this will better reflect how many typeahead searches result in at least one click
    window.history.replaceState(
      null,
      document.title,
      `${window.location.href.replace('&t=true', '')}`,
    );

    const bestBetPosition = index + 1;
    const normalResultPosition =
      index + (this.props.search?.recommendedResults?.length || 0) + 1;
    const searchResultPosition = bestBet
      ? bestBetPosition
      : normalResultPosition;

    const query = this.props.router?.location?.query?.query || '';

    const encodedUrl = encodeURIComponent(url);
    const userAgent = encodeURIComponent(navigator.userAgent);
    const encodedQuery = encodeURIComponent(query);
    const apiRequestOptions = {
      method: 'POST',
    };
    const moduleCode = bestBet ? 'BOOS' : 'I14Y';

    await apiRequest(
      `/search_click_tracking?position=${searchResultPosition}&query=${encodedQuery}&url=${encodedUrl}&user_agent=${userAgent}&module_code=${moduleCode}`,
      apiRequestOptions,
    );

    if (bestBet) {
      recordEvent({
        event: 'nav-searchresults',
        'nav-path': `Recommended Results -> ${title}`,
      });
    }

    recordEvent({
      event: 'onsite-search-results-click',
      'search-page-path': document.location.pathname,
      'search-query': query,
      'search-result-chosen-page-url': url,
      'search-result-chosen-title': title,
      'search-results-n-current-page': this.props.search?.currentPage,
      'search-results-position': searchResultPosition,
      'search-results-total-count': this.props.search?.totalEntries,
      'search-results-total-pages': Math.ceil(
        this.props.search?.totalEntries / 10,
      ),
      'search-results-top-recommendation': bestBet,
      'search-result-type': 'title',
      'search-selection': 'All VA.gov',
      'search-typeahead-enabled': this.props.searchTypeaheadEnabled,
      'search-typeahead-used': this.state.typeaheadUsed,
    });

    // relocate to clicked link page
    window.location.href = url;
  };

  onInputSubmit = componentState => {
    const savedSuggestions = componentState?.savedSuggestions || [];
    const suggestions = componentState?.suggestions || [];
    const inputValue = componentState?.inputValue;
    const validSuggestions =
      savedSuggestions.length > 0 ? savedSuggestions : suggestions;

    this.props.fetchSearchResults(inputValue, 1, {
      trackEvent: true,
      eventName: 'view_search_results',
      path: document.location.pathname,
      inputValue,
      typeaheadEnabled: true,
      keywordSelected: undefined,
      keywordPosition: undefined,
      suggestionsList: validSuggestions,
      sitewideSearch: false,
      searchLocation: 'Search Results Page',
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
  };

  handleInputChange = event => {
    this.setState({
      userInput: event.target.value,
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
      inputValue,
      typeaheadEnabled: true,
      keywordSelected: validSuggestions[index],
      keywordPosition: index + 1,
      suggestionsList: validSuggestions,
      sitewideSearch: false,
      searchLocation: 'Search Results Page',
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
  };

  fetchSuggestions = async inputValue => {
    // encode user input for query to suggestions url
    const encodedInput = encodeURIComponent(inputValue);

    // fetch suggestions
    try {
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

  renderResults() {
    const {
      loading,
      errors,
      currentPage,
      totalPages,
      results,
    } = this.props.search;
    const hasErrors = !!(errors && errors.length > 0);
    const { userInput } = this.state;

    // Reusable search input
    const searchInput = (
      <div
        className="vads-u-background-color--gray-lightest vads-u-padding-x--3 vads-u-padding-bottom--3 vads-u-padding-top--1p5 vads-u-margin-top--1p5 vads-u-margin-bottom--4"
        role="search"
        aria-labelledby="h1-search-title"
      >
        <div>Enter a keyword</div>
        <div className="va-flex search-box vads-u-margin-top--1 vads-u-margin-bottom--0">
          {!this.props.searchDropdownComponentEnabled && (
            <>
              <input
                type="text"
                name="query"
                aria-label="Enter a keyword"
                value={this.state.userInput}
                onChange={this.handleInputChange}
              />
              <button type="button" onClick={this.handleSearch}>
                <IconSearch color="#fff" />
                <span className="button-text">Search</span>
              </button>
            </>
          )}
          {this.props.searchDropdownComponentEnabled && (
            <SearchDropdownComponent
              buttonText="Search"
              canSubmit
              className="search-results-page-dropdown"
              formatSuggestions
              fullWidthSuggestions={false}
              mobileResponsive
              startingValue={userInput}
              submitOnClick
              submitOnEnter
              fetchSuggestions={this.fetchSuggestions}
              onInputSubmit={this.onInputSubmit}
              onSuggestionSubmit={this.onSuggestionSubmit}
            />
          )}
        </div>
      </div>
    );

    if (hasErrors && !loading) {
      return (
        <div className="columns error">
          {/* this is the alert box for when searches fail due to server issues */}
          <va-alert status="error" data-e2e-id="alert-box">
            <h3 slot="headline">Your search didn't go through</h3>
            <div>
              We’re sorry. Something went wrong on our end, and your search
              didn't go through. Please try again
            </div>
          </va-alert>
          {searchInput}
        </div>
      );
    }

    return (
      <div>
        {searchInput}
        {this.renderResultsInformation()}
        {this.renderRecommendedResults()}
        {this.renderResultsList()}
        <hr
          aria-hidden="true"
          id="hr-search-bottom"
          className="vads-u-margin-y--3"
        />

        <div className="va-flex results-footer">
          {results &&
            results.length > 0 && (
              <Pagination
                onPageSelect={this.handlePageChange}
                page={currentPage}
                pages={totalPages}
                maxPageListLength={5}
              />
            )}
          <span className="powered-by">Powered by Search.gov</span>
        </div>
      </div>
    );
  }

  renderRecommendedResults() {
    const { loading, recommendedResults } = this.props.search;
    if (!loading && recommendedResults && recommendedResults.length > 0) {
      return (
        <div>
          <h3
            className={`vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--bold`}
          >
            Our top recommendations for you
          </h3>
          <ul className="results-list">
            {recommendedResults.map((result, index) =>
              this.renderWebResult(result, 'description', true, index),
            )}
          </ul>
          <hr aria-hidden="true" />
        </div>
      );
    }

    return null;
  }

  renderResultsInformation() {
    const {
      currentPage,
      perPage,
      totalPages,
      totalEntries,
      loading,
      results,
    } = this.props.search;

    let resultRangeEnd = currentPage * perPage;

    if (currentPage === totalPages) {
      resultRangeEnd = totalEntries;
    }

    const resultRangeStart = (currentPage - 1) * perPage + 1;

    if (loading || !totalEntries) return null;

    // if there is a spelling correction, change the information message displayed
    if (this.props.search.spellingCorrection) {
      return (
        <>
          <p className="vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--normal vads-u-margin-top--2p5 vads-u-margin-bottom--1p5">
            No results for "
            <span className="vads-u-font-weight--bold">
              {this.props.router.location.query.query}
            </span>
            "
          </p>
          <h2
            className={`${SCREENREADER_FOCUS_CLASSNAME} vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--normal vads-u-margin-y--0p5`}
          >
            Showing{' '}
            {totalEntries === 0 ? '0' : `${resultRangeStart}-${resultRangeEnd}`}{' '}
            of {totalEntries} results for "
            <span className="vads-u-font-weight--bold">
              {this.props.search.spellingCorrection}
            </span>
            "
          </h2>
          <hr className="vads-u-margin-y--3" aria-hidden="true" />
        </>
      );
    }

    // regular display for how many search results total are available.
    /* eslint-disable prettier/prettier */
    if (results && results.length > 0) {
      return (
        <>
          <h2
            aria-live="polite"
            aria-relevant="additions text"
            className={`${SCREENREADER_FOCUS_CLASSNAME} vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--normal`}
          >
            Showing{' '}
            {totalEntries === 0 ? '0' : `${resultRangeStart}-${resultRangeEnd}`}{' '}
            of {totalEntries} results for "
            <span className="vads-u-font-weight--bold">
              {this.props.router.location.query.query}
            </span>
            "
          </h2>
          <hr className="vads-u-margin-y--3" aria-hidden="true" />
        </>
      );
    }

    return null;
    /* eslint-enable prettier/prettier */
  }

  renderResultsList() {
    const { results, loading } = this.props.search;
    const query = this.props.router?.location?.query?.query || '';
    if (loading) {
      return <LoadingIndicator message="Loading results..." />;
    }

    if (results && results.length > 0) {
      return (
        <>
          <h3 className="sr-only">More search results</h3>
          <ul className="results-list" data-e2e-id="search-results">
            {results.map((result, index) =>
              this.renderWebResult(result, undefined, undefined, index),
            )}
          </ul>
        </>
      );
    }
    if (query) {
      return (
        <p
          className={`${SCREENREADER_FOCUS_CLASSNAME}`}
          data-e2e-id="search-results-empty"
        >
          We didn't find any results for "<strong>{query}</strong>
          ." Try using different words or checking the spelling of the words
          you're using.
        </p>
      );
    }
    return (
      <p
        className={`${SCREENREADER_FOCUS_CLASSNAME}`}
        data-e2e-id="search-results-empty"
      >
        We didn't find any results. Enter a keyword in the search box to try
        again.
      </p>
    );
  }

  /* eslint-disable react/no-danger */
  renderWebResult(result, snippetKey = 'snippet', isBestBet = false, index) {
    const strippedTitle = removeDoubleBars(
      formatResponseString(result.title, true),
    );
    return (
      <li
        key={result.url}
        className="result-item vads-u-margin-top--1p5 vads-u-margin-bottom--4"
      >
        <a
          className={`result-title`}
          href={replaceWithStagingDomain(result.url)}
          onClick={this.onSearchResultClick({
            bestBet: isBestBet,
            title: strippedTitle,
            index,
            url: result.url,
          })}
        >
          <h4
            className="vads-u-display--inline  vads-u-margin-top--1 vads-u-margin-bottom--0p25 vads-u-font-size--md vads-u-font-weight--bold vads-u-font-family--serif vads-u-text-decoration--underline"
            data-e2e-id="result-title"
            dangerouslySetInnerHTML={{
              __html: strippedTitle,
            }}
          />
        </a>
        <p className="result-url vads-u-color--green vads-u-font-size--base">
          {replaceWithStagingDomain(result.url)}
        </p>
        <p
          className="result-desc"
          dangerouslySetInnerHTML={{
            __html: formatResponseString(
              truncateResponseString(
                result[snippetKey],
                MAX_DESCRIPTION_LENGTH,
              ),
            ),
          }}
        />
      </li>
    );
  }

  /* eslint-enable react/no-danger */
  render() {
    return (
      <div className="search-app" data-e2e-id="search-app">
        <SearchBreadcrumbs />
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
            <ul>
              <li>
                <a
                  className="right-nav-link"
                  href="https://www.index.va.gov/search/va/bva.jsp"
                  onClick={() =>
                    recordEvent({
                      event: 'nav-searchresults',
                      'nav-path':
                        'More VA Search Tools -> Look up BVA decisions',
                    })
                  }
                >
                  Look up Board of Veterans' Appeals (BVA) decisions
                </a>
              </li>
              <li>
                <a
                  className="right-nav-link"
                  href="https://www.index.va.gov/search/va/va_adv_search.jsp?SQ=www.benefits.va.gov/warms"
                  onClick={() =>
                    recordEvent({
                      event: 'nav-searchresults',
                      'nav-path':
                        'More VA Search Tools -> Search VA reference materials',
                    })
                  }
                >
                  Search VA reference materials (WARMS)
                </a>
              </li>
              <li>
                <a
                  className="right-nav-link"
                  href="/find-forms/"
                  onClick={() =>
                    recordEvent({
                      event: 'nav-searchresults',
                      'nav-path': 'More VA Search Tools -> Find a VA form',
                    })
                  }
                >
                  Find a VA form
                </a>
              </li>
              <li>
                <a
                  className="right-nav-link"
                  href="https://www.va.gov/vapubs/"
                  onClick={() =>
                    recordEvent({
                      event: 'nav-searchresults',
                      'nav-path':
                        'More VA Search Tools -> VA handbooks and other publications',
                    })
                  }
                >
                  VA handbooks and other publications
                </a>
              </li>
              <li>
                <a
                  className="right-nav-link"
                  href="https://www.vacareers.va.gov/job-search/index.asp"
                  onClick={() =>
                    recordEvent({
                      event: 'nav-searchresults',
                      'nav-path':
                        'More VA Search Tools -> Explore and apply for open VA jobs',
                    })
                  }
                >
                  Explore and apply for open VA jobs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.search,
  searchTypeaheadEnabled: toggleValues(state)[
    FEATURE_FLAG_NAMES.searchTypeaheadEnabled
  ],
  searchDropdownComponentEnabled: toggleValues(state)[
    FEATURE_FLAG_NAMES.searchDropdownComponentEnabled
  ],
});

const mapDispatchToProps = {
  fetchSearchResults,
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
