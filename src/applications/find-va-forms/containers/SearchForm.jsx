import React from 'react';

function SearchForm() {
  return (
    <form
      name="find-va-form"
      className="vads-l-grid-container vads-u-padding--0"
    >
      <label htmlFor="va-form-query" className="vads-u-margin--0">
        Keyword, form name, or number
      </label>
      <div className="vads-l-row">
        <div style={{ flexGrow: 1 }} className="vads-u-margin-right--2">
          <input
            className="usa-input vads-u-max-width--100 vads-u-width--full"
            name="va-form-query"
            type="text"
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

export default SearchForm;
