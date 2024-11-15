import React from 'react';
import Downshift from 'downshift';
import classNames from 'classnames';

export default function LcKeywordSearch({ inputValue, suggestions }) {
  return (
    <div id="keyword-search">
      <Downshift
        inputValue={inputValue}
        // onSelect={item => handleSuggestionSelected(item)}
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
            <label
              id="lc-search-label"
              className="lc-search-label"
              htmlFor="lc-search"
            >
              License/Certification Name
            </label>
            <div className="lc-name-search-container">
              <input
                aria-controls="lcKeywordSearch"
                className="lc-name-search-input"
                {...getInputProps({
                  type: 'text',
                  // onChange: handleChange,
                  // onKeyUp: handleEnterPress,
                  // onFocus: handleFocus,
                  'aria-labelledby': 'lc-search-label',
                })}
                // ref={inputRef}
              />
            </div>
            {isOpen && (
              <div
                className="suggestions-list"
                role="listbox"
                id="lcKeywordSearch"
              >
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
