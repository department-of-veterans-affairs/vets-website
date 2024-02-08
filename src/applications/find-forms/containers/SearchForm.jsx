import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getFindFormsAppState } from '../helpers/selectors';
import { fetchFormsThunk } from '../actions';

export const SearchForm = ({ fetchForms }) => {
  const query = new URLSearchParams(window.location.search).get('q') ?? '';
  const [queryState, setQueryState] = useState(query);
  const [showQueryError, setShowQueryError] = useState(false);

  const findFormInputFieldRef = useRef(null);

  useEffect(() => {
    if (queryState.length === 0) {
      setShowQueryError(false);
    } else if (queryState.length === 1) {
      setShowQueryError(true);
    } else if (queryState) {
      fetchForms(queryState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onlySpaces = str => /^\s+$/.test(str);
  const isLessThanTwoChars = str => str.length < 2;

  const setInputFieldFocus = selector => {
    const element =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
    if (element) element.focus();
  };

  const handleQueryChange = event => {
    const q = event.target.value;

    if (!isLessThanTwoChars(q)) {
      setShowQueryError(false);
    }

    // Prevent users from entering spaces because this will not trigger a change when they exit the field
    setQueryState(onlySpaces(q) ? q.trim() : q);
  };

  const onSubmitHandler = event => {
    event.preventDefault();

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

  const errorTestId = showQueryError ? 'find-form-error-body' : '';

  return (
    <div
      role="search"
      aria-label="Search VA Forms"
      className={`vads-l-grid-container vads-u-padding--3 vads-u-background-color--gray-lightest vads-u-margin-bottom--4 ${
        showQueryError ? 'usa-input-error' : ''
      }`}
      data-e2e-id="find-form-search-form"
    >
      <p
        data-e2e-id={errorTestId}
        data-testid={errorTestId}
        className="vads-u-margin--0"
      >
        Enter a keyword, form name, or number
        {showQueryError && (
          <span className="form-required-span" data-e2e-id="find-form-required">
            (*Required)
          </span>
        )}
      </p>
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
      <VaSearchInput
        value={queryState}
        label="Search for a VA form by keyword, form name, or form number"
        onInput={handleQueryChange}
        onSubmit={onSubmitHandler}
        buttonText="Search"
      />
    </div>
  );
};

SearchForm.propTypes = {
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
