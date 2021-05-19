import PropTypes from 'prop-types';
import React from 'react';
import { debounce } from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import Downshift from 'downshift';
import classNames from 'classnames';
import { WAIT_INTERVAL, KEY_CODES } from '../../constants';
import { handleScrollOnInputFocus } from '../../utils/helpers';

export function KeywordSearch({
  autocomplete,
  className,
  inputLabelledBy,
  onFetchAutocompleteSuggestions,
  onSelection,
  onUpdateAutocompleteSearchTerm,
  placeholder,
  searchError,
  validateSearchQuery,
  version,
}) {
  const handleFetchSuggestion = debounce(
    ({ value }) => {
      onFetchAutocompleteSuggestions(value, version);
    },
    WAIT_INTERVAL,
    {
      trailing: true,
    },
  );

  const handleSuggestionSelected = searchQuery => {
    recordEvent({
      event: 'gibct-autosuggest',
      'gibct-autosuggest-value': searchQuery,
    });

    onUpdateAutocompleteSearchTerm(searchQuery);
    onSelection(searchQuery);
  };

  const handleEnterPress = e => {
    if ((e.which || e.keyCode) === KEY_CODES.enterKey) {
      e.target.blur();
      onSelection(autocomplete.searchTerm);
    }
  };

  const handleFocus = () => {
    handleScrollOnInputFocus('keyword-search');
  };

  const handleChange = (e, searchQuery) => {
    if (e) {
      let value;
      if (typeof e === 'string') {
        value = e;
      } else {
        value = e.target.value;
      }
      onUpdateAutocompleteSearchTerm(value);
      handleFetchSuggestion({ value });
    }
    if (searchQuery) {
      onUpdateAutocompleteSearchTerm(searchQuery);
      handleFetchSuggestion({ searchQuery });
    }
    validateSearchQuery(searchQuery);
  };

  const { suggestions, searchTerm } = autocomplete;
  let errorSpan = '';
  let searchClassName = 'keyword-search';
  if (searchError) {
    searchClassName = 'usa-input-error';
    errorSpan = (
      <span
        className="usa-input-error-message"
        role="alert"
        id="search-error-message"
      >
        <span className="sr-only">Error</span>
        Please enter a city, school, or employer name.
      </span>
    );
  }

  return (
    <div className={searchClassName} id="keyword-search">
      {errorSpan}
      <Downshift
        inputValue={searchTerm}
        onSelect={item => handleSuggestionSelected(item)}
        itemToString={item => {
          if (typeof item === 'string' || !item) {
            return item;
          }
          return item.label;
        }}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          highlightedIndex,
          selectedItem,
        }) => (
          <div>
            <input
              className={classNames('input-box-margin', className)}
              {...getInputProps({
                type: 'text',
                placeholder,
                onChange: handleChange,
                onKeyUp: handleEnterPress,
                onFocus: handleFocus,
                'aria-labelledby': inputLabelledBy,
              })}
            />
            {isOpen && (
              <div className="suggestions-list" role="listbox">
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    role="option"
                    aria-selected={
                      selectedItem === item.label ? 'true' : 'false'
                    }
                    className={classNames('suggestion', {
                      'suggestion-highlighted': highlightedIndex === index,
                    })}
                    {...getItemProps({ item: item.label })}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Downshift>
    </div>
  );
}

KeywordSearch.defaultProps = {
  placeholder: '',
  onSelection: () => {},
  validateSearchQuery: () => {},
};

KeywordSearch.propTypes = {
  placeholder: PropTypes.string,
  version: PropTypes.string,
  inputLabelledBy: PropTypes.string,
  onFetchAutocompleteSuggestions: PropTypes.func,
  onSelection: PropTypes.func,
  onUpdateAutocompleteSearchTerm: PropTypes.func,
  searchError: PropTypes.bool,
  validateSearchQuery: PropTypes.func,
};

export default KeywordSearch;
