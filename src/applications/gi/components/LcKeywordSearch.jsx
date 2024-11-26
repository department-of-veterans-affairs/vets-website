import React from 'react';
import Downshift from 'downshift';

import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function LcKeywordSearch({
  inputValue,
  suggestions,
  onSelection,
  onUpdateAutocompleteSearchTerm,
}) {
  const handleChange = e => {
    const { value } = e.target;
    onUpdateAutocompleteSearchTerm(value);
  };

  const handleSuggestionSelected = selected => {
    const { name, type } = selected;

    onUpdateAutocompleteSearchTerm(name);

    if (onSelection) {
      onSelection({ type, state: 'FL' }); // remove hardcoded state
    }
  };

  const handleClearInput = () => {
    onUpdateAutocompleteSearchTerm('');
  };

  return (
    <div id="keyword-search">
      <Downshift
        inputValue={inputValue}
        onSelect={item => handleSuggestionSelected(item)}
        itemToString={item => {
          if (typeof item === 'string' || !item) {
            return item;
          }
          return item.name;
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
            <label
              id="lc-search-label"
              className="lc-search-label"
              htmlFor="lc-search"
            >
              License/Certification Name
            </label>
            <div className="lc-name-search-container vads-u-display--flex">
              <input
                style={
                  inputValue === ''
                    ? { maxWidth: '30rem' }
                    : { width: '100%', borderRight: 'none' }
                }
                aria-controls="lcKeywordSearch"
                className="lc-name-search-input"
                {...getInputProps({
                  type: 'text',
                  onChange: handleChange,
                  'aria-labelledby': 'lc-search-label',
                })}
              />
              {inputValue &&
                inputValue.length > 0 && (
                  <va-icon
                    size={3}
                    icon="cancel"
                    id="clear-input"
                    class="lc-clear vads-u-display--flex vads-u-align-items--center"
                    onClick={handleClearInput}
                  />
                )}
            </div>
            {isOpen &&
              suggestions.length > 0 && (
                <div
                  className="suggestions-list"
                  role="listbox"
                  id="lcKeywordSearch"
                  style={{ maxWidth: '30rem' }}
                >
                  {suggestions
                    .map((item, index) => (
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
                        {index !== 0 ? (
                          item.name
                        ) : (
                          <div className="keyword-suggestion-container">
                            <span className="vads-u-padding-right--1">
                              {item.name}
                            </span>
                            <span>
                              {`(${
                                suggestions.length > 1
                                  ? suggestions.length
                                  : 'No'
                              } results)`}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                    .slice(0, 5)}
                </div>
              )}
          </div>
        )}
      </Downshift>
    </div>
  );
}

LcKeywordSearch.propTypes = {
  inputValue: PropTypes.string,
  suggestions: PropTypes.array,
  onSelection: PropTypes.func,
  onUpdateAutocompleteSearchTerm: PropTypes.func,
};
