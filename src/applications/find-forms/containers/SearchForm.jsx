// Dependencies.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
// Relative imports.
import { getFindFormsAppState } from '../helpers/selectors';
import { fetchFormsThunk } from '../actions';

export const SearchForm = ({ fetchForms, fetching }) => {
  // Derive the current query params.
  const queryParams = new URLSearchParams(window.location.search);
  // Derive the query.
  const query = queryParams.get('q') || '';
  const [queryState, setQueryState] = useState(query);

  useEffect(() => {
    // On mount Fetch the forms with their query if it's on the URL.
    if (queryState) {
      fetchForms(queryState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQueryChange = event => {
    // Derive the new query value.
    const q = event.target.value;

    // Update our query in state.
    setQueryState(q);
  };

  const onSubmitHandler = event => {
    event.preventDefault();
    fetchForms(queryState);
  };

  return (
    <form
      data-e2e-id="find-form-search-form"
      className="vads-l-grid-container vads-u-padding--3 vads-u-background-color--gray-lightest vads-u-margin-bottom--4"
      name="find-va-form"
      onSubmit={onSubmitHandler}
    >
      <label
        htmlFor="va-form-query"
        className="vads-u-margin--0 vads-u-margin-bottom--1"
      >
        Enter a keyword, form name, or number
      </label>
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-u-flex--1 medium-screen:vads-u-width--auto">
          <input
            className="usa-input vads-u-margin--0 vads-u-margin-bottom--2 vads-u-max-width--100 vads-u-width--full medium-screen:vads-u-margin-bottom--0"
            id="va-form-query"
            onChange={onQueryChange}
            type="text"
            value={queryState}
          />
        </div>
        <div className="vads-l-col--12 medium-screen:vads-u-flex--auto medium-screen:vads-u-width--auto">
          <button
            className="usa-button vads-u-margin--0 vads-u-width--full vads-u-height--full find-form-button medium-screen:vads-u-width--auto"
            type="submit"
            disabled={fetching}
          >
            <i
              aria-hidden="true"
              className="fas fa-search vads-u-margin-right--0p5"
              role="presentation"
            />
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

SearchForm.propTypes = {
  // From mapStateToProps.
  fetching: PropTypes.bool.isRequired,
  // From mapDispatchToProps.
  fetchForms: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetching: getFindFormsAppState(state).fetching,
});

const mapDispatchToProps = dispatch => ({
  fetchForms: (query, options) => dispatch(fetchFormsThunk(query, options)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
