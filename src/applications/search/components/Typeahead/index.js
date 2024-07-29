import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchTypeaheadSuggestions } from '~/platform/utilities/search-utilities';

const Typeahead = ({
  formWasSubmitted,
  onInputSubmit,
  setFormWasSubmitted,
  setSavedSuggestions,
  setSuggestions,
  setUserInput,
  suggestions,
  userInput
}) => {
  const instance = useRef({ typeaheadTimer: null });

  const fetchSuggestions = useCallback(async searchValue => {
    const typeaheadSuggestions = await fetchTypeaheadSuggestions(searchValue);

    if (typeaheadSuggestions?.length) {
      setSuggestions(typeaheadSuggestions);
    }
  }, [setSuggestions]);

  useEffect(() => {
    // We landed on the page with a search term in the URL; fetch suggestions
    if (userInput) {
      const initialSuggestions = fetchSuggestions(userInput);
      console.log('calling it here');
      
      if (initialSuggestions?.length) {
        setSuggestions(initialSuggestions);
      }
    }
  }, [fetchSuggestions, setSuggestions, userInput]);

  const handleInputChange = event => {
    clearTimeout(instance.current.typeaheadTimer);
    
    instance.current.typeaheadTimer = setTimeout(() => {
      console.log('fetching suggestions');
      fetchSuggestions(userInput);
    }, 200);

    setUserInput(event.target.value);
    console.log('no im calling it here');

    if (userInput?.length <= 2) {
      setSuggestions([]);
      setSavedSuggestions([]);
    }

    if (formWasSubmitted) {
      setFormWasSubmitted(false);
    }
  };

  return (
    <VaSearchInput
      aria-labelledby="h1-search-title"
      buttonText="Search"
      class="vads-u-width--full"
      id="search-results-page-dropdown-input-field"
      data-e2e-id="search-results-page-dropdown-input-field"
      label="Enter a keyword, phrase, or question"
      onBlur={() => {
        console.log('search input is not focused');
        clearTimeout(instance.current.typeaheadTimer)
      }}
      onInput={handleInputChange}
      onSubmit={onInputSubmit}
      suggestions={suggestions}
      value={userInput}
    />
  );
};

Typeahead.propTypes = {
  formWasSubmitted: PropTypes.bool.isRequired,
  onInputSubmit: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  userInput: PropTypes.string.isRequired,
  setFormWasSubmitted: PropTypes.func.isRequired,
  setSavedSuggestions: PropTypes.func.isRequired,
  setSuggestions: PropTypes.func.isRequired,
  setUserInput: PropTypes.func.isRequired,
};

export default Typeahead;
