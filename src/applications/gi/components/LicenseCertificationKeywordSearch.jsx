import React from 'react';
import Downshift from 'downshift';

import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function LicenseCertificationKeywordSearch({
  inputValue,
  handleInput,
  suggestions,
  onSelection,
  onUpdateAutocompleteSearchTerm,
  handleClearInput,
}) {
  const handleChange = e => {
    const { value } = e.target;
    onUpdateAutocompleteSearchTerm(value);
  };

  const handleSuggestionSelected = selected => {
    // console.log('selected', selected);
    const { name, type, state } = selected;

    onSelection({
      type,
      state: type === 'license' || type === 'prep' ? state : 'all',
      name,
      selected,
    });
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
            <div className="vads-u-display--flex input-container">
              <input
                style={
                  inputValue === ''
                    ? { maxWidth: '30rem' }
                    : { width: '100%', borderRight: 'none' }
                }
                aria-controls="lcKeywordSearch"
                {...getInputProps({
                  type: 'text',
                  onChange: handleChange,
                  onInput: handleInput,
                  'aria-labelledby': 'lc-search-label',
                })}
              />
              {inputValue &&
                inputValue.length > 0 && (
                  <va-icon
                    size={3}
                    icon="cancel"
                    id="clear-input"
                    class="clear-icon vads-u-display--flex vads-u-align-items--center"
                    onClick={handleClearInput}
                  />
                )}
            </div>
            {isOpen &&
              inputValue && (
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
                          item.lacNm
                        ) : (
                          <div className="keyword-suggestion-container">
                            <span className="vads-u-padding-right--1">
                              {item.lacNm}
                            </span>
                            <span>
                              {`(${
                                suggestions.length > 1
                                  ? suggestions.length - 1
                                  : 'No'
                              } results)`}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                    .slice(0, 6)}
                </div>
              )}
          </div>
        )}
      </Downshift>
    </div>
  );
}

LicenseCertificationKeywordSearch.propTypes = {
  onSelection: PropTypes.func.isRequired,
  inputValue: PropTypes.string,
  suggestions: PropTypes.array,
  onUpdateAutocompleteSearchTerm: PropTypes.func,
};
