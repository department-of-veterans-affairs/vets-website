import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fetchSearchResults } from '../actions';
import { formatResponseString } from '../utils';

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
    if (this.props.router.location.query) {
      userInputFromAddress = this.props.router.location.query.q;
    }

    this.state = {
      userInput: userInputFromAddress,
    };
  }

  componentDidMount() {
    // If there's data in userInput, it must have come from the address bar, so we immediately hit the API.
    if (this.state.userInput) {
      this.props.fetchSearchResults(this.state.userInput);
    }
  }

  handleInputChange = event => {
    this.setState({
      userInput: event.target.value,
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    // @todo figure out how to sychronize the term in the search bar with the value being submitted, so that the search results are bookmarkable.
    // this.props.router.location.query.term = encodeURIComponent(userInput);
    this.props.fetchSearchResults(this.state.userInput);
  };

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
    const { results } = this.props.search;

    if (results && results.length > 0) {
      return (
        <ul className="results-list">
          {results.map(r => this.renderWebResult(r))}
        </ul>
      );
    }

    return <p>No results. Please try another search term.</p>;
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
          <div className="usa-width-three-fourths medium-8 small-12 columns">
            <form onSubmit={this.handleFormSubmit}>
              <input
                type="text"
                name="query"
                value={this.state.userInput}
                onChange={this.handleInputChange}
              />
              <button type="submit">Fetch search results</button>
            </form>
            <hr />
            {this.renderResults()}
          </div>
          <div className="usa-width-one-fourth medium-4 small-12 columns sidebar">
            <h4 className="highlight">More VA Search Tools</h4>
            <ul>
              <li>link one</li>
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
