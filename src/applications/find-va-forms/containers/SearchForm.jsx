import React from 'react';
import { connect } from 'react-redux';

import { updateQuery } from '../actions';

function SearchForm({ query, updateQuery: onQueryChange }) {
  return (
    <form
      name="find-va-form"
      className="vads-l-grid-container vads-u-padding--0"
    >
      <label htmlFor="va-form-query" className="vads-u-margin--0">
        Keyword, form name, or number
      </label>
      <div className="vads-l-row">
        <div className="vads-u-margin-right--2 vads-u-flex--1">
          <input
            className="usa-input vads-u-max-width--100 vads-u-width--full"
            name="va-form-query"
            type="text"
            value={query}
            onChange={event => onQueryChange(event.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="usa-button vads-u-margin--0 vads-u-margin-y--1"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

const mapStateToProps = state => ({
  query: state.findVaForms.query,
});

const mapDispatchToProps = {
  updateQuery,
};

export { SearchForm };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
