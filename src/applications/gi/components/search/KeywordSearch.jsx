import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import Downshift from 'downshift-v9';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { WAIT_INTERVAL, KEY_CODES } from '../../constants';
import {
  handleScrollOnInputFocus,
  validateSearchTerm,
} from '../../utils/helpers';
import { setError } from '../../actions';

export function KeywordSearch({
  className,
  inputValue,
  label,
  labelAdditional,
  onFetchAutocompleteSuggestions,
  onSelection,
  onUpdateAutocompleteSearchTerm,
  onPressEnter,
  required,
  suggestions,
  version,
  dispatchError,
  errorReducer,
  type,
  inputRef,
  isLocationSearch,
}) {
  const fetchSuggestion = () => {
    onFetchAutocompleteSuggestions(inputValue, version);
  };
  const { error } = errorReducer;

  const debouncedFetchSuggestion = useCallback(
    debounce(fetchSuggestion, WAIT_INTERVAL),
    [inputValue],
  );

  useEffect(
    () => {
      debouncedFetchSuggestion();

      // Cancel previous debounce calls during useEffect cleanup.
      return debouncedFetchSuggestion.cancel;
    },
    [inputValue, debouncedFetchSuggestion],
  );

  const handleSuggestionSelected = selected => {
    recordEvent({
      event: 'gibct-autosuggest',
      'gibct-autosuggest-value': selected.label,
    });

    onUpdateAutocompleteSearchTerm(selected.label);

    if (onSelection) {
      onSelection(selected);
    }
  };

  const handleEnterPress = e => {
    if ((e.which || e.keyCode) === KEY_CODES.enterKey) {
      e.target.blur();

      if (onPressEnter) {
        onPressEnter(e, inputValue);
      } else {
        onSelection(inputValue);
      }
    }
    if (e.key === 'Enter' && inputRef) {
      inputRef.current.focus();
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
        debouncedFetchSuggestion(value);
      }
      validateSearchTerm(value, dispatchError, error, type);
    }
  };

  const handleClearInput = () => {
    onUpdateAutocompleteSearchTerm('');
  };

  return (
    <div
      className={classNames('keyword-search', { 'usa-input-error': error })}
      id="keyword-search"
    >
      {label && (
        <div>
          {labelAdditional}
          <label
            id="institution-search-label"
            className="institution-search-label"
            htmlFor="institution-search"
          >
            {label}
            <span
              className={`form-required-span ${
                error ? 'vads-u-font-weight--bold' : ''
              }`}
            >
              (*Required)
            </span>
          </label>
        </div>
      )}
      {error && (
        <div>
          <span
            className="usa-input-error-message"
            role="alert"
            id="search-error-message"
            aria-live="assertive"
            aria-relevant="additions removals"
          >
            <span className="sr-only">Error</span>
            {error}
          </span>
        </div>
      )}
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
            <div
              className={`${
                isLocationSearch
                  ? 'input-container-location input-container'
                  : 'input-container'
              } input-container-width`}
            >
              <input
                data-testid="ct-input"
                aria-controls="ctKeywordSearch"
                className={classNames('input-box-margin', className)}
                {...getInputProps({
                  type: 'text',
                  required,
                  onChange: handleChange,
                  onKeyUp: handleEnterPress,
                  onFocus: handleFocus,
                  'aria-labelledby':
                    'search-error-message institution-search-label',
                })}
                ref={inputRef}
              />
              {/* eslint-disable-next-line no-nested-ternary */}
              {inputValue &&
                inputValue.length > 0 && (
                  <va-icon
                    size={3}
                    icon="cancel"
                    id="clear-input"
                    class="vads-u-display--flex vads-u-align-items--center"
                    onClick={handleClearInput}
                  />
                )}
            </div>
            {isOpen && (
              <div
                className="suggestions-list"
                role="listbox"
                id="ctKeywordSearch"
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
const mapStateToProps = state => ({
  errorReducer: state.errorReducer,
});
const mapDispatchToProps = {
  dispatchError: setError,
};

KeywordSearch.propTypes = {
  className: PropTypes.string,
  dispatchError: PropTypes.func,
  error: PropTypes.string,
  errorReducer: PropTypes.object,
  filters: PropTypes.object,
  inputRef: PropTypes.object,
  inputValue: PropTypes.string,
  label: PropTypes.string,
  labelAdditional: PropTypes.object,
  required: PropTypes.any,
  suggestions: PropTypes.array,
  type: PropTypes.string,
  validateSearchTerm: PropTypes.func,
  version: PropTypes.string,
  onFetchAutocompleteSuggestions: PropTypes.func,
  onPressEnter: PropTypes.func,
  onSelection: PropTypes.func,
  onUpdateAutocompleteSearchTerm: PropTypes.func,
  isLocationSearch: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(KeywordSearch);
