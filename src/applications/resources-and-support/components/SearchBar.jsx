import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  VaRadio,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import {
  PAGE_PATH,
  SEARCH_APP_USED,
  SEARCH_LOCATION,
  SEARCH_SELECTION,
  SEARCH_TYPEAHEAD_ENABLED,
  addSearchGADataToStorage,
} from 'platform/site-wide/search-analytics';
import URLSearchParams from 'url-search-params';
import resourcesSettings from '../manifest.json';

const searchUrl = getAppUrl('search');

function SearchBar({ onInputChange, previousValue, setSearchData, userInput }) {
  const [isGlobalSearch, setGlobalSearch] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [inputError, setInputError] = useState(false);
  const GLOBAL = 'All VA.gov';
  const RESOURCES = 'Resources and Support';

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

  const onSearch = () => {
    const queryParams = new URLSearchParams();
    queryParams.set('query', userInput);

    const URL = isGlobalSearch
      ? `${searchUrl}/`
      : `${resourcesSettings.rootUrl}/`;
    const newUrl = `${URL}?${queryParams}`;

    window.location.assign(newUrl);
  };

  const handleSubmit = event => {
    if (!event.target.value) {
      setInputError(true);
      return;
    }

    setInputError(false);

    if (setSearchData) {
      setSearchData();
    }

    // Don't run a search if the new value is the same as what's in the input already
    if (previousValue === userInput && !isGlobalSearch) {
      return;
    }

    const inputState = isInputValid(userInput);
    setInputError(!inputState);

    // Focus on input field if input is invalid and return early
    if (!inputState) {
      event.preventDefault();
      setInputFieldFocus(inputFieldRef.current);
      return;
    }

    if (isGlobalSearch) {
      addSearchGADataToStorage({
        [PAGE_PATH]: document.location.pathname,
        [SEARCH_LOCATION]: RESOURCES,
        [SEARCH_APP_USED]: false,
        [SEARCH_SELECTION]: 'All VA.gov',
        [SEARCH_TYPEAHEAD_ENABLED]: false,
      });
    }

    event.preventDefault();

    onSearch();
  };

  const onValueChange = ({ detail }) => {
    setGlobalSearch(detail.value === GLOBAL);
  };

  return (
    <div className="vads-u-border-bottom--0 medium-screen:vads-u-border-top--2px vads-u-border-color--gray-light vads-u-padding-top--3 vads-u-padding-bottom--0 medium-screen:vads-u-padding-bottom--3">
      <div>
        {/* Mobile expand/collapse */}
        <button
          className={classNames(
            'vads-u-align-items--center vads-u-width--full vads-u-display--flex vads-u-margin--0 vads-u-justify-content--space-between vads-u-padding-y--2 vads-u-color--primary-dark vads-u-background-color--gray-lightest medium-screen:vads-u-display--none',
            { 'va-border-bottom-radius--0': expanded },
          )}
          data-testid="rs-mobile-expand-collapse"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          Search resources and support
          <va-icon
            class={classNames(
              'vads-u-font-size--base vads-u-color--primary-dark',
              {
                'vads-u-display--none': expanded,
                'vads-u-visibility--visible': !expanded,
              },
            )}
            icon="add"
            size="3"
          />
          <va-icon
            class={classNames(
              'vads-u-font-size--base vads-u-color--primary-dark',
              {
                'vads-u-display--none': !expanded,
                'vads-u-visibility--visible': expanded,
              },
            )}
            icon="remove"
            size="3"
          />
        </button>
        <div
          className={classNames(
            'vads-u-flex-direction--column vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-padding--3 vads-u-border-top--1px vads-u-border-top-color--gray-light medium-screen:vads-u-border-top--0 medium-screen:vads-u-display--flex',
            { 'va-border-bottom-radius--5px': expanded },
            { 'vads-u-display--none': !expanded },
            { 'usa-input-error vads-u-margin--0': inputError },
          )}
          data-testid="resources-support-search"
          id="resources-support-search"
          data-e2e-id="resources-support-error-body"
        >
          <div className="rs-form-radio-buttons vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-display--block">
            <VaRadio
              class="vads-u-display--inline-block vads-u-margin-right--3 vads-u-margin-top--0"
              label="Search resources and support articles or all of VA.gov"
              label-header-level="2"
              onVaValueChange={onValueChange}
              uswds
            >
              <div className="medium-screen:vads-u-display--inline-block mobile-lg:vads-u-display--block vads-u-margin-right--2 mobile-lg:vads-u-margin-top--1 medium-screen:vads-u-margin-top--0">
                <va-radio-option
                  onChange={event => {
                    setGlobalSearch(!event.target.checked);
                  }}
                  checked={!isGlobalSearch}
                  label={RESOURCES}
                  name="group"
                  value={RESOURCES}
                  class="vads-u-color--gray-dark medium-screen:vads-u-margin-top--0"
                  data-e2e-id="resources-support-resource-radio"
                  uswds
                />
              </div>
              <div className="medium-screen:vads-u-display--inline-block mobile-lg:vads-u-display--block">
                <va-radio-option
                  onChange={event => setGlobalSearch(event.target.checked)}
                  checked={isGlobalSearch}
                  label={GLOBAL}
                  name="group"
                  value={GLOBAL}
                  class="vads-u-color--gray-dark medium-screen:vads-u-margin-top--0"
                  data-e2e-id="resources-support-resource-all-va-radio"
                  uswds
                />
              </div>
            </VaRadio>
          </div>
          <p className="mobile-lg:vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 vads-u-margin-bottom--0p5">
            Enter a keyword, phrase, or question
            {inputError && (
              <span
                className="form-required-span"
                data-e2e-id="resources-support-required"
              >
                (*Required)
              </span>
            )}
          </p>
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
            buttonText="Search"
            disableAnalytics
            label="Enter a keyword, phrase, or question"
            onInput={handleInputChange}
            onSubmit={e => handleSubmit(e)}
            ref={inputFieldRef}
            uswds
            value={userInput}
          />
        </div>
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  previousValue: PropTypes.string,
  userInput: PropTypes.string,
  onInputChange: PropTypes.func,
  setSearchData: PropTypes.func,
};

export default SearchBar;
