import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fetchSearchResults } from '../actions';
import { formatResponseString } from '../utils';
import recordEvent from 'platform/monitoring/record-event';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';

import { focusElement } from 'platform/utilities/ui';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import IconSearch from '@department-of-veterans-affairs/formation-react/IconSearch';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

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

    let userInputFromAddress = '';
    let page;

    if (this.props.router.location.query) {
      userInputFromAddress = this.props.router.location.query.query;
      page = this.props.router.location.query.page;
    }

    this.state = {
      userInput: userInputFromAddress,
      currentResultsQuery: userInputFromAddress,
      page,
    };

    if (!userInputFromAddress) {
      window.location.href = '/';
    }
  }

  componentDidMount() {
    // If there's data in userInput, it must have come from the address bar, so we immediately hit the API.
    const { userInput, page } = this.state;
    if (userInput) {
      this.props.fetchSearchResults(userInput, page);
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
    this.props.fetchSearchResults(userInput, nextPage);

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

  renderResults() {
    const { loading, errors } = this.props.search;
    const hasErrors = !!(errors && errors.length > 0);
    const nonBlankUserInput =
      this.state.userInput &&
      this.state.userInput.replace(/\s/g, '').length > 0;

    // Reusable search input
    const searchInput = (
      <form onSubmit={this.handleSearch} className="va-flex search-box">
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
            {recommendedResults.map(r =>
              this.renderWebResult(r, 'description', true),
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
        <ul className="results-list">
          {results.map(r => this.renderWebResult(r))}
        </ul>
      );
    }

    return (
      <p>
        Sorry, no results found. Try again using different (or fewer) words.
      </p>
    );
  }

  /* eslint-disable react/no-danger */
  renderWebResult(result, snippetKey = 'snippet', isBestBet = false) {
    const strippedTitle = formatResponseString(result.title, true);
    return (
      <li key={result.url} className="result-item">
        <a
          className={`result-title ${SCREENREADER_FOCUS_CLASSNAME}`}
          href={replaceWithStagingDomain(result.url)}
          onClick={
            isBestBet
              ? () =>
                  recordEvent({
                    event: 'nav-searchresults',
                    'nav-path': `Recommended Results -> ${strippedTitle}`,
                  })
              : null
          }
        >
          <h5
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
      <div className="search-app">
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
            <h4 className="highlight">More VA Search Tools</h4>
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
                  href="https://www.index.va.gov/search/va/va_adv_search.jsp?SQ=www.va.gov/vaforms,www.va.gov/vapubs,www.va.gov/vhapublications,www.vba.va.gov/pubs/forms"
                  onClick={() =>
                    recordEvent({
                      event: 'nav-searchresults',
                      'nav-path':
                        'More VA Search Tools -> Find VA forms and publications',
                    })
                  }
                >
                  Find VA forms and publications
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

function mapStateToProps(state) {
  const { search } = state;
  return { search };
}

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
