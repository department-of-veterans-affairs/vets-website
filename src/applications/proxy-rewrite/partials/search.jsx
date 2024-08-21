/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Keycodes = {
  Enter: 13,
  Tab: 9,
};

const Search = ({ isDesktop, searchIsOpen }) => {
  const [inputValue, setInputValue] = useState('');
  const searchInput = document.getElementById(
    'search-header-dropdown-input-field',
  );

  useEffect(
    () => {
      if (searchInput && searchIsOpen) {
        searchInput.focus();
      }
    },
    [searchInput, searchIsOpen],
  );

  const handleInputChange = event => {
    setInputValue(event.target.value);
  };

  const onInputSubmit = () => {
    const searchUrl = `https://www.va.gov/search/?query=${encodeURIComponent(
      inputValue,
    )}&t=${false}`;

    window.location.assign(searchUrl);
  };

  const onKeyDown = event => {
    const currentKeyPress = event.which || event.keyCode;

    if (currentKeyPress === Keycodes.Enter) {
      event.preventDefault();
      onInputSubmit();
    }
  };

  const handleButtonShift = event => {
    const currentKeyPress = event.which || event.keycode;

    if (event.shiftKey && currentKeyPress === Keycodes.Tab) {
      event.preventDefault();
      document.getElementById('search-header-dropdown-input-field').focus();
    }
  };

  if (!isDesktop) {
    return (
      <>
        <label
          className="vads-u-font-weight--normal vads-u-color--gray-dark vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-left--1p5"
          htmlFor="search-header-dropdown-input-field"
        >
          Search
        </label>
        <div className="search-dropdown-component vads-u-display--flex vads-u-width--full full-width-suggestions vads-u-padding-x--0p5">
          <div className="search-dropdown-container vads-u-width--full vads-u-flex-direction--column full-width-suggestions vads-u-padding-y--1 vads-u-padding-left--1 vads-u-padding-right--0 vads-u-padding-bottom--2 vads-u-margin--0 search-input-container">
            <input
              aria-autocomplete="none"
              autoComplete="off"
              className="vads-u-width--full search-dropdown-input-field"
              id="search-header-dropdown-input-field"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={onKeyDown}
            />{' '}
          </div>
          <button
            type="submit"
            className="search-button search-dropdown-submit-button vads-u-margin-right--1 vads-u-font-size--base vads-u-padding-left--1p5"
            id="search-header-dropdown-submit-button"
            onClick={onInputSubmit}
            onKeyDown={handleButtonShift}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              width="18"
              viewBox="2 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
              />
            </svg>
            <span className="usa-sr-only">Search</span>
          </button>
        </div>
      </>
    );
  }

  // Desktop
  return (
    <div className="search-dropdown-component vads-u-display--flex vads-u-width--full">
      <div className="search-dropdown-container vads-u-width--full vads-u-flex-direction--column vads-u-padding-y--1 vads-u-padding-left--1 vads-u-padding-right--0">
        <input
          aria-autocomplete="none"
          aria-label="Search"
          autoComplete="off"
          className="vads-u-width--full search-dropdown-input-field"
          id="search-header-dropdown-input-field"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <button
        type="submit"
        className="search-button vads-u-margin-right--1 vads-u-margin-top--1 vads-u-font-size--base vads-u-padding-left--1p5"
        onClick={onInputSubmit}
        onKeyDown={handleButtonShift}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          width="18"
          viewBox="3 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
          />
        </svg>
        <span className="usa-sr-only">Search</span>
      </button>
    </div>
  );
};

Search.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
  searchIsOpen: PropTypes.bool,
};

export default Search;
