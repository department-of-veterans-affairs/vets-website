import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fetchSearchResults } from '../actions';
import { formatResponseString } from '../utils';
import recordEvent from '../../../platform/monitoring/record-event';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import IconSearch from '@department-of-veterans-affairs/formation/IconSearch';
import Pagination from '@department-of-veterans-affairs/formation/Pagination';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

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
      this.writeBreadcrumb();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.search.query !== prevProps.search.query) {
      this.writeBreadcrumb();
    }
  }

  handlePageChange = page => {
    this.setState({ page }, () => this.handleSearch());
  };

  handleSearch = e => {
    if (e) e.preventDefault();
    const { userInput, page } = this.state;
    this.props.router.push({
      pathname: '',
      query: {
        query: encodeURIComponent(userInput),
        page,
      },
    });
    this.props.fetchSearchResults(userInput, page);
  };

  handleInputChange = event => {
    this.setState({
      userInput: event.target.value,
    });
  };

  writeBreadcrumb() {
    const breadcrumbList = document.getElementById('va-breadcrumbs-list');
    const lastCrumb = breadcrumbList.lastElementChild.children[0];
    if (breadcrumbList && lastCrumb) {
      lastCrumb.text = `Search Results for '${this.props.search.query}'`;
    }
  }

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
      <div className="usa-width-three-fourths medium-8 small-12 columns">
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
          <h4>Our Top Recommendations for You</h4>
          <ul className="results-list">
            {recommendedResults.map(r =>
              this.renderWebResult(r, 'description'),
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
      <p>
        Showing {totalEntries === 0 ? '0' : `${resultRangeStart}-${resultRangeEnd}`} of {totalEntries} results
      </p>
    );
    /* eslint-enable prettier/prettier */
  }

  renderResultsList() {
    const { results, loading } = this.props.search;

    if (loading) {
      return <LoadingIndicator message="Loading results..." setFocus />;
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
  renderWebResult(result, snippetKey = 'snippet') {
    return (
      <li key={result.url} className="result-item">
        <a className="result-title" href={result.url}>
          <h5
            dangerouslySetInnerHTML={{
              __html: formatResponseString(result.title, true),
            }}
          />
        </a>
        <p className="result-url">{result.url}</p>
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
        <strong>Powered by Search.gov</strong>
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
        <div className="row">
          <div className="columns">
            <h2>Search VA.gov</h2>
          </div>
        </div>
        <div className="row">
          {this.renderResults()}
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
