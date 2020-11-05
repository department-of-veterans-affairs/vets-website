import React, { useState } from 'react';

import resourcesSettings from '../manifest.json';
import searchSettings from 'applications/search/manifest.json';

export default function SearchBar({ onSearch, userInput, onInputChange }) {
  const [isGlobalSearch, setGlobalSearch] = useState(false);

  const disabled = userInput.length < 3;

  const onSubmit = event => {
    event.preventDefault();
    if (!disabled) {
      onSearch();
    }
  };

  return (
    <div className="vads-u-border-top--2px vads-u-border-color--gray-light vads-u-padding-y--3">
      <form
        onSubmit={isGlobalSearch ? null : onSubmit}
        id="resources-support-search"
        method="get"
        action={
          isGlobalSearch
            ? `${searchSettings.rootUrl}/`
            : `${resourcesSettings.rootUrl}/`
        }
      >
        <fieldset className="fieldset-input vads-u-margin--0">
          <legend className="vads-u-font-size--md vads-u-font-family--serif">
            Search resources and support articles or all of VA.gov
          </legend>
          <label
            className="vads-u-visibility--screen-reader"
            htmlFor="website-section"
          >
            Website section to search
          </label>
          <div className="form-radio-buttons">
            <div className="radio-button vads-u-display--inline-block vads-u-margin-right--3">
              <input
                type="radio"
                checked={!isGlobalSearch}
                onChange={event => {
                  setGlobalSearch(!event.target.checked);
                }}
                id="search-within-resources-and-support"
                value="/resources/search"
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
                type="radio"
                checked={isGlobalSearch}
                onChange={event => {
                  setGlobalSearch(event.target.checked);
                }}
                id="search-all-of-va-dot-gov"
                value="/search"
              />
              <label htmlFor="search-all-of-va-dot-gov">
                <span className="vads-u-visibility--screen-reader">Search</span>{' '}
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
        </label>
        <div className="vads-l-row">
          <div className="vads-l-col--12 vads-u-flex--1 vads-u-width--auto">
            <input
              type="text"
              required
              name="query"
              id="resources-and-support-query"
              className="usa-input vads-u-max-width--100 vads-u-width--full vads-u-height--full vads-u-margin--0"
              value={userInput}
              onChange={event => onInputChange(event.target.value)}
            />
          </div>
          <div className="vads-l-col--12 vads-u-flex--auto vads-u-width--auto">
            <button
              type="submit"
              disabled={disabled}
              className="usa-button vads-u-margin--0 vads-u-width--full vads-u-width--auto vads-u-height--full"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <i className="fa fa-search"> </i> Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
