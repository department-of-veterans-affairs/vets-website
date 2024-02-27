// Node modules.
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import resourcesSettings from '../manifest.json';

const searchUrl = getAppUrl('search');

export default function SearchBar({
  onInputChange,
  onSearch,
  useDefaultFormSearch,
  userInput,
}) {
  const [isGlobalSearch, setGlobalSearch] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [inputError, setInputError] = useState(false);

  const inputFieldRef = useRef(null);

  // Checks if string is only spaces
  const onlySpaces = str => /^\s+$/.test(str);

  // Checks if the string is not empty
  const isInputValid = str => str.length !== 0;

  // Sets focus on the input field
  const setInputFieldFocus = selector => {
    const element =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
    if (element) element.focus();
  };

  const handleInputChange = event => {
    const input = event.target.value;

    // If input is now valid, remove the error
    if (isInputValid(input)) setInputError(false);

    // Trim the string if spaces and submit to OnChange handler
    onInputChange(onlySpaces(input) ? input.trim() : input);
  };

  const onFormSubmit = () => {
    const baseURL = isGlobalSearch
      ? `${searchUrl}/`
      : `${resourcesSettings.rootUrl}/`;
    const url = `${baseURL}?query=${userInput}`;
    window.location.href = url;
  };

  const handleSubmit = event => {
    event.preventDefault();
    // First, check input state is valid and set error status.
    const inputState = isInputValid(userInput);
    setInputError(!inputState);

    // Focus on input field if input is invalid and return early
    if (!inputState) {
      event.preventDefault();
      setInputFieldFocus(inputFieldRef.current);
      return;
    }

    // Second, check if a global search, record event and return early
    if (isGlobalSearch) {
      recordEvent({
        event: 'view_search_results',
        'search-page-path': document.location.pathname,
        'search-query': userInput,
        'search-results-total-count': undefined,
        'search-results-total-pages': undefined,
        'search-selection': 'All VA.gov',
        'search-typeahead-enabled': false,
        'search-location': 'Resources And Support',
        'sitewide-search-app-used': false, // this is not the sitewide search app
        'type-ahead-option-keyword-selected': undefined,
        'type-ahead-option-position': undefined,
        'type-ahead-options-list': undefined,
        'type-ahead-options-count': undefined,
      });
      onFormSubmit();
    }

    // Third, check if we are not on the /resources/search page and exit early to let the form submit manually
    if (useDefaultFormSearch) {
      onFormSubmit();
    }

    // Fourth, we are at /resources/search so handle the search
    event.preventDefault();
    onSearch();
  };

  return (
    <div className="vads-u-border-bottom--0 medium-screen:vads-u-border-top--2px vads-u-border-color--gray-light vads-u-padding-top--3 vads-u-padding-bottom--0 medium-screen:vads-u-padding-bottom--3">
      <div className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
        {/* Mobile expand/collapse */}
        <button
          className={`${
            expanded ? 'va-border-bottom-radius--0 ' : ''
          }vads-u-width--full vads-u-display--flex vads-u-margin--0 vads-u-padding-x--2 vads-u-justify-content--space-between vads-u-padding-y--2 vads-u-color--primary-darker vads-u-background-color--gray-lightest medium-screen:vads-u-display--none`}
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          Search resources and support
          <i
            className={`${
              expanded ? 'vads-u-display--none ' : ''
            }fa fa-sliders-h vads-u-font-size--base vads-u-color--primary-darker`}
            id="sliders-icon"
            aria-hidden="true"
          />
          <i
            className={`${
              expanded ? '' : 'vads-u-display--none '
            }fa fa-times vads-u-font-size--base vads-u-color--primary-darker`}
            id="times-icon"
            aria-hidden="true"
          />
        </button>

        {/* Search form */}
        <div
          className={`${
            expanded ? 'va-border-bottom-radius--5px' : 'vads-u-display--none'
          } vads-u-flex-direction--column vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-padding--3 vads-u-border-top--1px vads-u-border-color--gray-light medium-screen:vads-u-border-top--0 medium-screen:vads-u-display--flex`}
        >
          <div
            role="search"
            className={`${
              inputError ? 'usa-input-error vads-u-margin--0' : ''
            }`}
            data-e2e-id="resources-support-error-body"
            aria-label="Search resources and support articles or all of VA.gov"
          >
            <fieldset className="fieldset-input vads-u-margin--0">
              <legend>
                <h2 className="vads-u-font-size--base vads-u-font-family--serif vads-u-margin--0">
                  Search resources and support articles or all of VA.gov
                </h2>
              </legend>
              <label
                className="vads-u-visibility--screen-reader"
                htmlFor="website-section"
              >
                Website section to search
              </label>
              <div className="form-radio-buttons vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-display--block">
                <div className="radio-button vads-u-display--inline-block vads-u-margin-right--3">
                  <input
                    checked={!isGlobalSearch}
                    id="search-within-resources-and-support"
                    onChange={event => {
                      setGlobalSearch(!event.target.checked);
                    }}
                    type="radio"
                    value="/resources/search"
                    className="vads-u-color--gray-dark"
                    data-e2e-id="resources-support-resource-radio"
                  />
                  <label htmlFor="search-within-resources-and-support">
                    <span className="vads-u-visibility--screen-reader">
                      Search within
                    </span>{' '}
                    Resources and support
                  </label>
                </div>
                <div className="radio-button vads-u-display--inline-block">
                  <input
                    checked={isGlobalSearch}
                    id="search-all-of-va-dot-gov"
                    onChange={event => setGlobalSearch(event.target.checked)}
                    type="radio"
                    className="vads-u-color--gray-dark"
                    data-e2e-id="resources-support-resource-all-va-radio"
                  />
                  <label htmlFor="search-all-of-va-dot-gov">
                    <span className="vads-u-visibility--screen-reader">
                      Search
                    </span>{' '}
                    All VA.gov
                  </label>
                </div>
              </div>
            </fieldset>
            <label
              className="vads-u-margin-top--1"
              htmlFor="resources-and-support-query"
            >
              Enter a keyword, phrase, or question
              {inputError && (
                <span
                  className="form-required-span"
                  data-e2e-id="resources-support-required"
                >
                  (*Required)
                </span>
              )}
            </label>
            {inputError && (
              <span
                className="usa-input-error-message vads-u-margin-bottom--0p5"
                role="alert"
                data-e2e-id="resources-support-error-message"
              >
                <span className="sr-only">Error</span>
                Please fill in a keyword, phrase, or question.
              </span>
            )}
            <VaSearchInput
              id="resources-and-support-query"
              onInput={handleInputChange}
              onSubmit={handleSubmit}
              value={userInput}
              uswds
            />
          </div>
        </div>
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  userInput: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  useDefaultFormSearch: PropTypes.bool,
  onSearch: PropTypes.func,
};
