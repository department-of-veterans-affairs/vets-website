import React from 'react';
import PropTypes from 'prop-types';

const SearchMessagesForm = props => {
  const { advancedSearchOpen, keyword } = props;

  return (
    <form className="search-form">
      <va-text-input
        label="Enter keyword"
        name="keyword"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        class="textField"
        value={keyword}
      />

      <va-select label="Search in" name="searchIn" value="" class="selectField">
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

          <va-select label="Date range" name="dateRange" class="selectField">
            <option value="all">Any</option>
            <option value="all">Past week</option>
            <option value="compose">Past month</option>
            <option value="drafts">Past year</option>
            <option value="drafts">All time</option>
          </va-select>

          <div className="includes-attachment">
            <input id="includesAttachment" type="checkbox" />
            <label
              className="usa-input-label"
              name="includes-attachment-label"
              htmlFor="includesAttachment"
            >
              <i className="fa fa-paperclip" aria-hidden="true" />
              Includes attachment
            </label>
          </div>
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
          <i className="fas fa-search" aria-hidden="true" />
          <span className="search-messages-button-text">Search</span>
        </button>
      )}
    </form>
  );
};

SearchMessagesForm.propTypes = {
  advancedSearchOpen: PropTypes.bool,
  keyword: PropTypes.string,
};

export default SearchMessagesForm;
