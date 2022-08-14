import React from 'react';
import PropTypes from 'prop-types';

const SearchMessagesForm = props => {
  const { advancedSearchOpen } = props;

  return (
    <form className="search-messages-form">
      <va-text-input
        label="Enter Keyword"
        name="keyword"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        class="textField"
      />

      <va-select
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-live-region-text="You selected"
        label="Search in"
        name="searchIn"
        value=""
        class="selectField"
      >
        <option value="all">All message folders</option>
        <option value="compose">compose</option>
        <option value="drafts">drafts</option>
        <option value="sent">sent</option>
        <option value="deleted">deleted</option>
      </va-select>

      {advancedSearchOpen && (
        <section className="advanced-search-fields">
          <va-text-input
            label="Message ID"
            name="messageId"
            onBlur={function noRefCheck() {}}
            onInput={function noRefCheck() {}}
            class="textField"
          />
          <va-text-input
            label="From"
            name="from"
            onBlur={function noRefCheck() {}}
            onInput={function noRefCheck() {}}
            class="textField"
          />
          <va-text-input
            label="Subject"
            name="subject"
            onBlur={function noRefCheck() {}}
            onInput={function noRefCheck() {}}
            class="textField"
          />
          <va-select
            // eslint-disable-next-line jsx-a11y/aria-props
            aria-live-region-text="You selected"
            label="Category"
            name="category"
            value=""
            class="selectField"
          >
            <option value=" "> </option>
            <option value="all">one</option>
            <option value="compose">two</option>
            <option value="drafts">three</option>
          </va-select>

          <va-select
            // eslint-disable-next-line jsx-a11y/aria-props
            aria-live-region-text="You selected"
            label="Date range"
            name="dateRange"
            class="selectField"
          >
            <option value="all">Any</option>
            <option value="all">Past week</option>
            <option value="compose">Past month</option>
            <option value="drafts">Past year</option>
            <option value="drafts">All time</option>
          </va-select>

          <va-checkbox
            label="&#x1F4CE; Includes attachment"
            name="includesAttachment"
            class="includes-attachment"
          />
        </section>
      )}

      {advancedSearchOpen ? (
        <div className="advanced-search-actions">
          <button type="submit">Advanced Search</button>
          <button type="button" className="reset">
            Reset Search
          </button>
        </div>
      ) : (
        <button type="submit" className="search-messages-button">
          <i className="fas fa-search" />
          <span className="search-messages-button-text">Search</span>
        </button>
      )}
    </form>
  );
};

SearchMessagesForm.propTypes = {
  advancedSearchOpen: PropTypes.bool,
};

export default SearchMessagesForm;
