// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';
import { MAX_PAGE_LIST_LENGTH } from '../containers/SearchResults';
import { getFindFormsAppState } from '../helpers/selectors';
import { fetchFormsThunk } from '../actions';
import * as customPropTypes from '../prop-types';

export class SearchForm extends Component {
  static propTypes = {
    // From mapStateToProps.
    fetching: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(customPropTypes.Form.isRequired),
    // From mapDispatchToProps.
    fetchFormsThunk: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    // Derive the current query params.
    const queryParams = new URLSearchParams(window.location.search);

    // Derive the query.
    const query = queryParams.get('q') || '';

    this.state = {
      query,
    };
  }

  componentDidMount() {
    const { query } = this.state;
    // Fetch the forms with their query if it's on the URL.
    if (query) this.props.fetchFormsThunk(query);
  }

  componentDidUpdate(prevProps) {
    const { query } = this.state;
    const { fetching, results } = this.props;
    if (!fetching && results && prevProps.results !== results) {
      // Derive the total number of pages.
      const totalPages = Math.ceil(results.length / MAX_PAGE_LIST_LENGTH);
      recordEvent({
        event: 'view_search_results', // remains consistent, push this event with each search
        'search-page-path': '/find-forms', // populate with '/find-forms', remains consistent for all searches from find-forms page
        'search-query': query, // populate with full query user used to execute search
        'search-results-total-count': results.length, // populate with total number of search results returned
        'search-results-total-pages': totalPages, // populate with total number of search result pages returned
        'search-selection': 'Find forms', // populate with 'Find forms' for all searches from /find-forms page
        'search-typeahead-enabled': false, // populate with boolean false, remains consistent since type ahead won't feature here
        'sitewide-search-app-used': false, // this is not the sitewide search app
        'type-ahead-option-keyword-selected': undefined, // populate with undefined since type ahead won't feature here
        'type-ahead-option-position': undefined, // populate with undefined since type ahead won't feature here
        'type-ahead-options-list': undefined, // populate with undefined since type ahead won't feature here
      });
    }
  }

  onQueryChange = event => {
    // Derive the new query value.
    const query = event.target.value;

    // Update our query in state.
    this.setState({ query });
  };

  onSubmitHandler = async event => {
    event.preventDefault();
    this.props.fetchFormsThunk(this.state.query);
  };

  render() {
    const { onSubmitHandler, onQueryChange } = this;
    const { fetching } = this.props;
    const { query } = this.state;

    return (
      <form
        data-e2e-id="find-form-search-form"
        className="vads-l-grid-container vads-u-padding--2 medium-screen:vads-u-padding--4 vads-u-background-color--gray-lightest vads-u-margin-bottom--4"
        name="find-va-form"
        onSubmit={onSubmitHandler}
      >
        <label htmlFor="va-form-query" className="vads-u-margin--0">
          Enter a keyword, form name, or number
        </label>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-u-margin-right--2 medium-screen:vads-u-flex--1 medium-screen:vads-u-width--auto">
            <input
              className="usa-input vads-u-max-width--100 vads-u-width--full"
              id="va-form-query"
              onChange={onQueryChange}
              type="text"
              value={query}
            />
          </div>
          <div className="vads-l-col--12 medium-screen:vads-u-flex--auto medium-screen:vads-u-width--auto">
            <button
              className="usa-button vads-u-margin--0 vads-u-margin-y--1 vads-u-width--full medium-screen:vads-u-width--auto"
              type="submit"
              disabled={fetching}
            >
              Search
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  fetching: getFindFormsAppState(state).fetching,
  results: getFindFormsAppState(state).results,
});

const mapDispatchToProps = {
  fetchFormsThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
