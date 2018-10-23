import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fetchSearchResults } from '../actions';
import { formatResponseString } from '../utils';
import { PAGE_SIZE } from '../constants';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import IconSearch from '@department-of-veterans-affairs/formation/IconSearch';

import SimplePagination from '../components/SimplePagination';

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
    let offset;

    if (this.props.router.location.query) {
      userInputFromAddress = this.props.router.location.query.q;
      offset = this.props.router.location.query.offset;
    }

    this.state = {
      userInput: userInputFromAddress,
      offset,
    };

    if (!userInputFromAddress) {
      window.location.href = '/';
    }
  }

  componentDidMount() {
    // If there's data in userInput, it must have come from the address bar, so we immediately hit the API.
    const { userInput, offset } = this.state;
    if (userInput) {
      this.props.fetchSearchResults(userInput, offset);
    }
  }

  handleInputChange = event => {
    this.setState({
      userInput: event.target.value,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { userInput, offset } = this.state;
    this.props.router.push({
      pathname: '',
      query: {
        q: encodeURIComponent(userInput),
        offset,
      },
    });
    this.props.fetchSearchResults(userInput, offset);
  };

  /* eslint-disable arrow-body-style */
  handlePageChange = offset => {
    return e => {
      e.preventDefault();
      e.persist();
      this.setState({ offset }, () => this.handleSearch(e));
    };
  };
  /* eslint-enable arrow-body-style */

  /* eslint-disable react/no-danger */
  renderWebResult(result) {
    return (
      <li key={result.url} className="result-item">
        <a
          className="result-title"
          href={result.url}
          dangerouslySetInnerHTML={{
            __html: formatResponseString(result.title),
          }}
        />
        <p className="result-url">{result.url}</p>
        <p
          className="result-desc"
          dangerouslySetInnerHTML={{
            __html: formatResponseString(result.snippet),
          }}
        />
      </li>
    );
  }
  /* eslint-enable react/no-danger */

  renderResults() {
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

  renderResultsFooter() {
    const { prevOffset, nextOffset } = this.props.search;

    return (
      <div className="va-flex results-footer">
        <strong>Powered by Search.gov</strong>
        <SimplePagination
          handlePageChange={this.handlePageChange}
          prevOffset={prevOffset}
          nextOffset={nextOffset}
        />
      </div>
    );
  }

  renderResultsCount() {
    const { prevOffset, total } = this.props.search;
    let currentRange;

    if (prevOffset) {
      currentRange = `${prevOffset + 1}-${prevOffset + PAGE_SIZE}`;
    } else {
      currentRange = `1-${PAGE_SIZE}`;
    }

    return (
      <p>
        Showing {currentRange} of {total} results
      </p>
    );
  }

  render() {
    if (!this.state.userInput) {
      return null;
    }

    return (
      <div className="search-app">
        <div className="row">
          <div className="columns">
            <h2>Search VA.gov</h2>
          </div>
        </div>
        <div className="row">
          <div className="usa-width-three-fourths medium-8 small-12 columns">
            <form onSubmit={this.handleSearch} className="va-flex search-box">
              <input
                type="text"
                name="query"
                value={this.state.userInput}
                onChange={this.handleInputChange}
              />
              <button type="submit">
                <IconSearch color="#fff" />
                <span>Search</span>
              </button>
            </form>
            {this.renderResultsCount()}
            <hr />
            {this.renderResults()}
            <hr />
            {this.renderResultsFooter()}
          </div>
          <div className="usa-width-one-fourth medium-4 small-12 columns sidebar">
            <h4 className="highlight">More VA Search Tools</h4>
            <ul>
              <li>
                <a href="https://www.index.va.gov/search/va/bva.jsp">
                  Look up Board of Veterans' Appeals (BVA) decisions
                </a>
              </li>
              <li>
                <a href="https://www.index.va.gov/search/va/va_adv_search.jsp?SQ=www.benefits.va.gov/warms">
                  Search VA reference materials (WARMS)
                </a>
              </li>
              <li>
                <a href="https://www.index.va.gov/search/va/va_adv_search.jsp?SQ=www.va.gov/vaforms,www.va.gov/vapubs,www.va.gov/vhapublications,www.vba.va.gov/pubs/forms">
                  Find VA forms and publications
                </a>
              </li>
              <li>
                <a href="https://www.vacareers.va.gov/job-search/index.asp">
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
