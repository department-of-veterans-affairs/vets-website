import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { fetchSearchResults } from '../actions';
import { formatResponseString } from '../utils';
import recordEvent from 'platform/monitoring/record-event';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';

import { focusElement } from 'platform/utilities/ui';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import IconSearch from '@department-of-veterans-affairs/component-library/IconSearch';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { apiRequest } from 'platform/utilities/api';

import SearchBreadcrumbs from '../components/SearchBreadcrumbs';

const SCREENREADER_FOCUS_CLASSNAME = 'sr-focus';

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

    this.state = {
      userInput: userInputFromURL,
      currentResultsQuery: userInputFromURL,
      page: pageFromURL,
    };

    if (!userInputFromURL) {
      window.location.href = '/';
    }
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
      const shouldFocusOnResults = this.props.search.searchesPerformed > 1;

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
    // Update URL
    this.props.router.push({
      pathname: '',
      query: {
        query: userInput,
        page: nextPage,
      },
    });

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
      this.setState({ currentResultsQuery: userInput, page: 1 });
    }
  };

  handleInputChange = event => {
    this.setState({
      userInput: event.target.value,
    });
  };

  onSearchResultClick = ({ bestBet, title, index, url }) => () => {
    if (bestBet) {
      recordEvent({
        event: 'nav-searchresults',
        'nav-path': `Recommended Results -> ${title}`,
      });
    }

    const bestBetPosition = index + 1;
    const normalResultPosition =
      index + (this.props.search?.recommendedResults?.length || 0) + 1;
    const searchResultPosition = bestBet
      ? bestBetPosition
      : normalResultPosition;

    const query = this.props.router?.location?.query?.query || '';

    recordEvent({
      event: 'onsite-search-results-click',
      'search-page-path': document.location.pathname,
      'search-query': query,
      'search-result-chosen-page-url': url,
      'search-result-chosen-title': title,
      'search-results-pagination-current-page': this.props.search?.currentPage,
      'search-results-position': searchResultPosition,
      'search-results-total-count': this.props.search?.totalEntries,
      'search-results-total-pages': Math.ceil(
        this.props.search?.totalEntries / 10,
      ),
      'search-results-top-recommendation': bestBet,
      'search-result-type': 'title',
      'search-selection': 'All VA.gov',
      'search-typeahead-enabled': this.props.searchTypeaheadEnabled,
    });

    const encodedUrl = encodeURIComponent(url);
    const userAgent = encodeURIComponent(navigator.userAgent);
    const searchClickTrackingEndpoint = `/search_click_tracking`;
    const encodedQuery = encodeURIComponent(query);
    const apiRequestOptions = {
      method: 'POST',
    };

    apiRequest(
      `${searchClickTrackingEndpoint}?position=${searchResultPosition}&query=${encodedQuery}&url=${encodedUrl}&user_agent=${userAgent}`,
      apiRequestOptions,
    );
  };

  renderResults() {
    const { loading, errors } = this.props.search;
    const hasErrors = !!(errors && errors.length > 0);
    const nonBlankUserInput =
      this.state.userInput &&
      this.state.userInput.replace(/\s/g, '').length > 0;

    // Reusable search input
    const searchInput = (
      <form
        onSubmit={this.handleSearch}
        className="va-flex search-box"
        data-e2e-id="search-form"
      >
        <input
          type="text"
          name="query"
          aria-label="Enter the word or phrase you'd like to search for"
          value={this.state.userInput}
          onChange={this.handleInputChange}
        />
        <button type="submit" disabled={!nonBlankUserInput}>
          <IconSearch color="#fff" />
          <span>Search</span>
        </button>
      </form>
    );

    if (hasErrors && !loading) {
      return (
        <div className="usa-width-three-fourths medium-8 small-12 columns error">
          <AlertBox
            status="error"
            headline="Your search didn't go through"
            content="We’re sorry. Something went wrong on our end, and your search didn't go through. Please try again."
            data-e2e-id="alert-box"
          />
          {searchInput}
        </div>
      );
    }

    return (
      <div>
        {searchInput}
        {this.renderResultsCount()}
        <hr />
        {this.renderRecommendedResults()}
        {this.renderResultsList()}
        <hr id="hr-search-bottom" />
        {this.renderResultsFooter()}
      </div>
    );
  }

  renderRecommendedResults() {
    const { loading, recommendedResults } = this.props.search;
    if (!loading && recommendedResults && recommendedResults.length > 0) {
      return (
        <div>
          <h4 className={SCREENREADER_FOCUS_CLASSNAME}>
            Our top recommendations for you
          </h4>
          <ul className="results-list">
            {recommendedResults.map((result, index) =>
              this.renderWebResult(result, 'description', true, index),
            )}
          </ul>
          <hr />
        </div>
      );
    }

    return null;
  }

  renderResultsCount() {
    const {
      currentPage,
      perPage,
      totalPages,
      totalEntries,
      loading,
    } = this.props.search;

    let resultRangeEnd = currentPage * perPage;

    if (currentPage === totalPages) {
      resultRangeEnd = totalEntries;
    }

    const resultRangeStart = (currentPage - 1) * perPage + 1;

    if (loading || !totalEntries) return null;

    /* eslint-disable prettier/prettier */
    return (
      <p aria-live="polite" aria-relevant="additions text">
        Showing{' '}
        {totalEntries === 0 ? '0' : `${resultRangeStart}-${resultRangeEnd}`} of{' '}
        {totalEntries} results
        <span className="usa-sr-only">
          {' '}
          for "{this.props.router.location.query.query}"
        </span>
      </p>
    );
    /* eslint-enable prettier/prettier */
  }

  renderResultsList() {
    const { results, loading } = this.props.search;

    if (loading) {
      return <LoadingIndicator message="Loading results..." />;
    }

    if (results && results.length > 0) {
      return (
        <ul className="results-list" data-e2e-id="search-results">
          {results.map((result, index) =>
            this.renderWebResult(result, undefined, undefined, index),
          )}
        </ul>
      );
    }

    return (
      <p data-e2e-id="search-results-empty">
        Sorry, no results found. Try again using different (or fewer) words.
      </p>
    );
  }

  /* eslint-disable react/no-danger */
  renderWebResult(result, snippetKey = 'snippet', isBestBet = false, index) {
    const strippedTitle = formatResponseString(result.title, true);
    return (
      <li key={result.url} className="result-item">
        <a
          className={`result-title ${SCREENREADER_FOCUS_CLASSNAME}`}
          href={replaceWithStagingDomain(result.url)}
          onClick={this.onSearchResultClick({
            bestBet: isBestBet,
            title: strippedTitle,
            index,
            url: result.url,
          })}
        >
          <h5
            data-e2e-id="result-title"
            dangerouslySetInnerHTML={{
              __html: strippedTitle,
            }}
          />
        </a>
        <p className="result-url">{replaceWithStagingDomain(result.url)}</p>
        <p
          className="result-desc"
          dangerouslySetInnerHTML={{
            __html: formatResponseString(result[snippetKey]),
          }}
        />
      </li>
    );
  }
  /* eslint-enable react/no-danger */

  renderResultsFooter() {
    const { currentPage, totalPages } = this.props.search;

    return (
      <div className="va-flex results-footer">
        <span className="powered-by">Powered by Search.gov</span>
        <Pagination
          onPageSelect={this.handlePageChange}
          page={currentPage}
          pages={totalPages}
          maxPageListLength={5}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="search-app" data-e2e-id="search-app">
        <SearchBreadcrumbs query={this.props.search.query} />
        <div className="row">
          <div className="columns">
            <h2>Search VA.gov</h2>
          </div>
        </div>
        <div className="row">
          <div className="usa-width-three-fourths medium-8 small-12 columns">
            <DowntimeNotification
              appTitle="Search App"
              dependencies={[externalServices.search]}
            >
              {this.renderResults()}
            </DowntimeNotification>
          </div>
          <div className="usa-width-one-fourth medium-4 small-12 columns sidebar">
            <h4 className="highlight">More VA search tools</h4>
            <ul>
              <li>
                <a
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
