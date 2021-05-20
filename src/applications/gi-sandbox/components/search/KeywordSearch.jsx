import PropTypes from 'prop-types';
import React from 'react';
import { debounce } from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import Downshift from 'downshift';
import classNames from 'classnames';
import { WAIT_INTERVAL, KEY_CODES } from '../../constants';
import { handleScrollOnInputFocus } from '../../utils/helpers';

export function KeywordSearch({
  className,
  inputLabelledBy,
  inputValue,
  onFetchAutocompleteSuggestions,
  onSelection,
  onUpdateAutocompleteSearchTerm,
  placeholder,
  suggestions,
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

  const handleSuggestionSelected = selected => {
    recordEvent({
      event: 'gibct-autosuggest',
      'gibct-autosuggest-value': selected.label,
    });

    onUpdateAutocompleteSearchTerm(selected.label);
    onSelection(selected);
  };

  const handleEnterPress = e => {
    if ((e.which || e.keyCode) === KEY_CODES.enterKey) {
      e.target.blur();
      onSelection(inputValue);
    }
  };

  const handleFocus = () => {
    handleScrollOnInputFocus('keyword-search');
  };

  const handleChange = e => {
    if (e) {
      let value;
      if (typeof e === 'string') {
        value = e;
      } else {
        value = e.target.value;
      }
      onUpdateAutocompleteSearchTerm(value);
      if (value !== '') {
        handleFetchSuggestion({ value });
      }
    }
  };

  return (
    <div
      className={'keyword-search vads-u-display--inline-block'}
      id="keyword-search"
    >
      <Downshift
        inputValue={inputValue}
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
                    {...getItemProps({ item })}
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
};

KeywordSearch.propTypes = {
  placeholder: PropTypes.string,
  version: PropTypes.string,
  inputLabelledBy: PropTypes.string,
  onFetchAutocompleteSuggestions: PropTypes.func,
  onSelection: PropTypes.func,
  onUpdateAutocompleteSearchTerm: PropTypes.func,
  validateSearchQuery: PropTypes.func,
};

export default KeywordSearch;
