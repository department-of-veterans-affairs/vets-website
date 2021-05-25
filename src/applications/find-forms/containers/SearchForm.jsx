// Dependencies.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
// Relative imports.
import {
  getFindFormsAppState,
  applyLighthouseFormsSearchLogic,
} from '../helpers/selectors';
import { fetchFormsThunk } from '../actions';

export const SearchForm = ({
  fetchForms,
  fetching,
  useLighthouseSearchAlgo,
}) => {
  // Derive the current query params.
  const queryParams = new URLSearchParams(window.location.search);
  // Derive the query.
  const query = queryParams.get('q') || '';
  const [queryState, setQueryState] = useState(query);

  useEffect(() => {
    // On mount Fetch the forms with their query if it's on the URL.
    if (queryState) {
      fetchForms(queryState, { useLighthouseSearchAlgo });
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
    fetchForms(queryState, { useLighthouseSearchAlgo });
  };

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
            value={queryState}
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
};

SearchForm.propTypes = {
  // From mapStateToProps.
  fetching: PropTypes.bool.isRequired,
  useLighthouseSearchAlgo: PropTypes.bool,
  // From mapDispatchToProps.
  fetchForms: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetching: getFindFormsAppState(state).fetching,
  useLighthouseSearchAlgo: applyLighthouseFormsSearchLogic(state),
});

const mapDispatchToProps = dispatch => ({
  fetchForms: (query, options) => dispatch(fetchFormsThunk(query, options)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
