import React from 'react';

const SearchMessagesForm = () => {
  return (
    <form className="search-messages-form">
      <va-text-input
        label="Enter Keyword"
        name="keyword"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        class="searchKeyword"
      />

      <va-select
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-live-region-text="You selected"
        label="Search in"
        name="searchIn"
        value=""
        class="searchFolder"
      >
        <option value="all">All message folders</option>
        <option value="compose">compose</option>
        <option value="drafts">drafts</option>
        <option value="sent">sent</option>
        <option value="deleted">deleted</option>
      </va-select>

      <button type="button" className="search-messages-button">
        <i className="fas fa-search" />
        <span className="search-messages-button-text">Search</span>
      </button>
    </form>
  );
};

export default SearchMessagesForm;
