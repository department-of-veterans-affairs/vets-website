import PropTypes from 'prop-types';
import React from 'react';
import {
  PAGE_PATH,
  SEARCH_LOCATION,
  SEARCH_APP_USED,
  SEARCH_SELECTION,
  SEARCH_TYPEAHEAD_ENABLED,
  TYPEAHEAD_CLICKED,
  TYPEAHEAD_LIST,
  addSearchGADataToStorage,
} from 'platform/site-wide/search-analytics';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';

import SearchDropdownComponent from './SearchDropdownComponent';
import DropDownPanel from './DropDownPanel/DropDownPanel';
import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';

export class SearchMenu extends React.Component {
  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;

    // focus the query input when the search menu is opened
    const inputField = document.getElementById('query');
    if (isOpen && !prevProps.isOpen && inputField) {
      inputField.focus();
    }

    // focus the search dropdown input field when the search menu is opened
    const dropdownInputField = document.getElementById(
      'search-header-dropdown-input-field',
    );

    if (isOpen && !prevProps.isOpen && dropdownInputField) {
      dropdownInputField.focus();
    }
  }

  onInputSubmit = componentState => {
    const savedSuggestions = componentState?.savedSuggestions || [];
    const suggestions = componentState?.suggestions || [];
    const inputValue = componentState?.inputValue;
    const validSuggestions =
      savedSuggestions.length > 0 ? savedSuggestions : suggestions;

    addSearchGADataToStorage({
      [PAGE_PATH]: document.location.pathname,
      [SEARCH_LOCATION]: 'Desktop Header Search',
      [SEARCH_APP_USED]: false,
      [SEARCH_SELECTION]: 'All VA.gov',
      [SEARCH_TYPEAHEAD_ENABLED]: false,
      [TYPEAHEAD_LIST]: validSuggestions,
    });

    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        inputValue,
      )}&t=${false}`,
    );

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  onSuggestionSubmit = (index, componentState) => {
    const savedSuggestions = componentState?.savedSuggestions || [];
    const suggestions = componentState?.suggestions || [];
    const validSuggestions =
      savedSuggestions?.length > 0 ? savedSuggestions : suggestions;

    const analyticsData = {
      [PAGE_PATH]: document.location.pathname,
      [SEARCH_LOCATION]: 'Desktop Header Search',
      [SEARCH_APP_USED]: false,
      [SEARCH_SELECTION]: 'All VA.gov',
      [SEARCH_TYPEAHEAD_ENABLED]: false,
      [TYPEAHEAD_CLICKED]: true,
      [TYPEAHEAD_LIST]: validSuggestions,
    };

    addSearchGADataToStorage(analyticsData);

    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        validSuggestions[index],
      )}&t=${true}`,
    );

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  makeForm = () => {
    return (
      <SearchDropdownComponent
        buttonText=""
        canSubmit
        id="search-header-dropdown"
        componentClassName=""
        containerClassName=""
        inputClassName=""
        suggestionsListClassName=""
        suggestionClassName=""
        fullWidthSuggestions
        formatSuggestions
        startingValue=""
        submitOnClick
        submitOnEnter
        onInputSubmit={this.onInputSubmit}
        onSuggestionSubmit={this.onSuggestionSubmit}
      />
    );
  };

  render() {
    const { makeForm } = this;
    const { cssClass, clickHandler, isOpen } = this.props;

    const buttonClasses = classNames(
      'sitewide-search-drop-down-panel-button',
      cssClass,
      'va-btn-withicon',
      'va-dropdown-trigger',
    );

    const icon = (
      <>
        {/* search icon on the header (next to "Search") */}
        {/* Convert to va-icon when injected header/footer split is in prod: https://github.com/department-of-veterans-affairs/vets-website/pull/27590 */}
        <svg
          aria-hidden="true"
          className="vads-u-margin-right--0p5"
          focusable="false"
          width="24"
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
      </>
    );

    return (
      <DropDownPanel
        buttonText="Search"
        clickHandler={clickHandler}
        cssClass={buttonClasses}
        dropdownPanelClassNames="vads-u-padding--0 vads-u-margin--0"
        icon={icon}
        id="search"
        isOpen={isOpen}
        onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
      >
        {makeForm()}
      </DropDownPanel>
    );
  }
}

SearchMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func,
  cssClass: PropTypes.string,
  debounceRate: PropTypes.number,
};

SearchMenu.defaultProps = {
  debounceRate: 200,
};

export default SearchMenu;
