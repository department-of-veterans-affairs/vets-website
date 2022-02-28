// Dependencies.
import React, { useEffect, useState, useRef } from 'react';
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
  const [showQueryError, setShowQueryError] = useState(false);

  const findFormInputFieldRef = useRef(null);

  useEffect(() => {
    // Check if URL query is zero chars, disable error initially
    if (queryState.length === 0) setShowQueryError(false);
    // Check if URL query is one char, show error
    else if (queryState.length === 1) setShowQueryError(true);
    // If URL query is valid, fetch the forms.
    else if (queryState) {
      fetchForms(queryState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Checks if string is only spaces
  const onlySpaces = str => /^\s+$/.test(str);

  // Checks if string is less than two chars
  const isLessThanTwoChars = str => str.length < 2;

  // Sets focus on the input field
  const setInputFieldFocus = selector => {
    const element =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
    if (element) element.focus();
  };

  // Handles the input textbox change
  const handleQueryChange = event => {
    // Derive the new query value.
    const q = event.target.value;

    // Set error if query is less than 2 chars
    if (!isLessThanTwoChars(q)) setShowQueryError(false);

    // Update our query in state
    // Also prevent users from entering spaces because this will not trigger a change when they exit the field
    setQueryState(onlySpaces(q) ? q.trim() : q);
  };

  // Handles clicking the Search button
  const onSubmitHandler = event => {
    event.preventDefault();

    // Check if query is valid to search
    const checkQueryState = isLessThanTwoChars(queryState);
    setShowQueryError(checkQueryState);

    // If not valid, set focus on input and return early
    if (checkQueryState) {
      setInputFieldFocus(findFormInputFieldRef.current);
      return;
    }

    // Fetch the forms if valid query
    fetchForms(queryState);
  };

  return (
    <form
      data-e2e-id="find-form-search-form"
      className="vads-l-grid-container vads-u-padding--3 vads-u-background-color--gray-lightest vads-u-margin-bottom--4"
      name="find-va-form"
      onSubmit={onSubmitHandler}
    >
      <div
        className={`vads-u-margin--0 vads-u-padding-y-0 ${
          showQueryError ? 'usa-input-error' : ''
        }`}
        data-e2e-id="find-form-error-body"
      >
        <label
          htmlFor="va-form-query"
          className={`vads-u-margin--0 ${
            !showQueryError ? 'vads-u-margin-bottom--1' : ''
          }`}
        >
          Enter a keyword, form name, or number
          {showQueryError && (
            <span
              className="form-required-span"
              data-e2e-id="find-form-required"
            >
              (*Required)
            </span>
          )}
        </label>
        {showQueryError && (
          <span
            className="usa-input-error-message vads-u-margin-bottom--0p5"
            role="alert"
            data-e2e-id="find-form-error-message"
          >
            <span className="sr-only">Error</span>
            Please fill in a keyword, form name, or number.
          </span>
        )}
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-u-flex--1 medium-screen:vads-u-width--auto">
            <input
              className="usa-input vads-u-margin--0 vads-u-margin-bottom--2 vads-u-max-width--100 vads-u-width--full vads-u-color--gray-dark medium-screen:vads-u-margin-bottom--0"
              ref={findFormInputFieldRef}
              id="va-form-query"
              onChange={handleQueryChange}
              type="text"
              value={queryState}
              data-e2e-id="find-form-input"
            />
          </div>
          <div className="vads-l-col--12 medium-screen:vads-u-flex--auto medium-screen:vads-u-width--auto">
            <button
              className="usa-button vads-u-margin--0 vads-u-width--full vads-u-height--full medium-screen:vads-u-width--auto medium-screen-va-border-left-radius--0"
              type="submit"
              disabled={fetching}
              data-e2e-id="find-form-search"
            >
              <i
                aria-hidden="true"
                className="fa fa-search vads-u-margin-right--0p5"
                role="presentation"
              />
              Search
            </button>
          </div>
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
