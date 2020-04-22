// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchFormsThunk } from '../actions';

export class SearchForm extends Component {
  static propTypes = {
    // From mapStateToProps.
    fetching: PropTypes.bool.isRequired,
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
    // Fetch the forms with their query if it's on the URL.
    if (this.state.query) {
      this.props.fetchFormsThunk(this.state.query);
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
          Keyword, form name, or number
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
  fetching: state.findVAFormsReducer.fetching,
});

const mapDispatchToProps = {
  fetchFormsThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
