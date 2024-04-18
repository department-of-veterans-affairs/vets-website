import React, { useCallback /* , useEffect */ } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import classNames from 'classnames';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { WAIT_INTERVAL /* , KEY_CODES */ } from '../../constants';

export function VAKeywordSearch({
  error,
  inputValue,
  label,
  labelAdditional,
  onFetchAutocompleteSuggestions,
  onUpdateAutocompleteSearchTerm,
  required,
  validateSearchTerm,
  version,
  handleSubmit,
  suggestions,
  showFiltersBeforeSearch,
}) {
  const fetchSuggestion = () => {
    onFetchAutocompleteSuggestions(inputValue, version);
  };

  const debouncedFetchSuggestion = useCallback(
    debounce(fetchSuggestion, WAIT_INTERVAL),
    [inputValue],
  );

  const handleChange = async e => {
    // update input value to new value
    const { value } = e.target;
    onUpdateAutocompleteSearchTerm(value);
    if (value !== '') {
      debouncedFetchSuggestion(value);
    }
    if (validateSearchTerm) {
      validateSearchTerm(value);
    }
  };

  const initializeSuggestionForVADropdown = () => {
    const result = [];
    suggestions.map(item => {
      result.push(item.label);
      return result;
    });
    return result.length > 0 && showFiltersBeforeSearch ? result : undefined;
  };
  const vaSuggestions = initializeSuggestionForVADropdown();

  return (
    <div
      className={classNames('keyword-search', { 'usa-input-error': error })}
      aria-label="Search Schools by Name"
      role="search"
    >
      {label && (
        <div>
          {labelAdditional}
          <label
            id="institution-search-label"
            className="institution-search-label"
            htmlFor="institution-search"
          >
            <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
              {label}
            </h1>
          </label>
          {required && <span className="form-required-span">(*Required)</span>}
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
      <VaSearchInput
        onInput={handleChange}
        onSubmit={handleSubmit}
        suggestions={vaSuggestions}
        value={inputValue}
        uswds
        big
      />
    </div>
  );
}

VAKeywordSearch.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  inputValue: PropTypes.string,
  label: PropTypes.string,
  labelAdditional: PropTypes.object,
  required: PropTypes.any,
  showFiltersBeforeSearch: PropTypes.bool,
  suggestions: PropTypes.array,
  validateSearchTerm: PropTypes.func,
  version: PropTypes.string,
  onFetchAutocompleteSuggestions: PropTypes.func,
  onUpdateAutocompleteSearchTerm: PropTypes.func,
};

export default VAKeywordSearch;
