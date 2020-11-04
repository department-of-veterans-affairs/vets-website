import React, { useState } from 'react';

export default function SearchBar({ onSearch, userInput, onInputChange }) {
  const [isGlobalSearch, setGlobalSearch] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const disabled = userInput.length < 3;

  const onSubmit = event => {
    event.preventDefault();
    if (!disabled) {
      onSearch();
    }
  };

  return (
    <div className="vads-u-border-top--2px vads-u-border-color--gray-light vads-u-padding-y--3 vads-u-padding-x--1">
      {/* Mobile expand/collapse */}
      <button
        className="vads-u-width--full vads-u-display--flex vads-u-margin--0 vads-u-padding-x--2 vads-u-justify-content--space-between vads-u-padding-y--2 vads-u-color--primary-darker vads-u-background-color--gray-lightest medium-screen:vads-u-display--none"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        Search resources and support
        <i
          className="fa fa-sliders-h vads-u-font-size--base vads-u-color--primary-darker"
          id="sliders-icon"
          aria-hidden="true"
        />
        <i
          className="vads-u-display--none fa fa-times vads-u-font-size--base vads-u-color--primary-darker"
          id="times-icon"
          aria-hidden="true"
        />
      </button>

      {/* Search form */}
      <form
        action={isGlobalSearch ? '/search' : '/resources/search'}
        className={`${expanded ? '' : 'vads-u-display--none'} vads-u-flex-direction--column vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-padding--2 vads-u-border-top--1px vads-u-border-color--gray-light medium-screen:vads-u-border-top--0 medium-screen-va-background-color--white medium-screen:vads-u-display--flex`}
        id="resources-support-search"
        method="get"
        onSubmit={isGlobalSearch ? null : onSubmit}
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
          <div className="form-radio-buttons vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-display--block">
            <div className="radio-button vads-u-display--inline-block vads-u-margin-right--3">
              <input
                checked={!isGlobalSearch}
                id="search-within-resources-and-support"
                onChange={event => { setGlobalSearch(!event.target.checked); }}
                type="radio"
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
                checked={isGlobalSearch}
                id="search-all-of-va-dot-gov"
                onChange={event => setGlobalSearch(event.target.checked)}
                type="radio"
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
        <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
          <div className="vads-l-col--12 vads-u-flex--1 vads-u-width--auto">
            <input
              className="usa-input vads-u-max-width--100 vads-u-width--full vads-u-height--full vads-u-margin--0"
              id="resources-and-support-query"
              name="query"
              onChange={(event => onInputChange(event.target.value))}
              required
              type="text"
              value={userInput}
            />
          </div>
          <div className="vads-l-col--12 vads-u-flex--auto vads-u-width--full vads-u-margin-top--2 medium-screen:vads-u-margin-top--0 medium-screen:vads-u-width--auto">
            <button
              className="usa-button vads-u-margin--0 vads-u-width--full vads-u-height--full medium-screen-va-border-left-radius--0"
              disabled={disabled}
              type="submit"
            >
              <i className="fa fa-search"> </i> Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
