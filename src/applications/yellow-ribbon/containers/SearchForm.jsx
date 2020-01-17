// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchResultsThunk } from '../actions';

export class SearchForm extends Component {
  static propTypes = {
    // From mapStateToProps.
    fetching: PropTypes.bool.isRequired,
    // From mapDispatchToProps.
    fetchResultsThunk: PropTypes.func.isRequired,
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
    // Fetch the results with their query if it's on the URL.
    if (this.state.query) {
      this.props.fetchResultsThunk(this.state.query);
    }
  }

  onQueryChange = event => {
    // Derive the new query value.
    const query = event.target.value;

    // Update our query in state.
    this.setState({ query });
  };

  onSubmitHandler = event => {
    event.preventDefault();
    this.props.fetchResultsThunk(this.state.query);
  };

  render() {
    const { onSubmitHandler, onQueryChange } = this;
    const { query } = this.state;

    return (
      <form
        className="vads-l-grid-container vads-u-padding--0"
        name="yellow-ribbon-form"
        onSubmit={onSubmitHandler}
      >
        <label htmlFor="va-form-query" className="vads-u-margin--0">
          Keyword, form name, or number
        </label>
        <div className="vads-l-row">
          <div className="vads-u-margin-right--2 vads-u-flex--1">
            <input
              className="usa-input vads-u-max-width--100 vads-u-width--full"
              name="va-form-query"
              onChange={onQueryChange}
              type="text"
              value={query}
            />
          </div>
          <div>
            <button
              className="usa-button vads-u-margin--0 vads-u-margin-y--1"
              type="submit"
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
  fetching: state.yellowRibbonReducer.fetching,
});

const mapDispatchToProps = {
  fetchResultsThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
