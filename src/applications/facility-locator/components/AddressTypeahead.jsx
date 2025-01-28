import React, { useCallback, useEffect, useState } from 'react';
import vaDebounce from 'platform/utilities/data/debounce';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import UseMyLocation from './UseMyLocation';
import AddressInputError from './AddressInputError';
import { searchAddresses } from '../utils/mapHelpers';
import Typeahead from './Typeahead';

const MIN_SEARCH_CHARS = 3;
const onlySpaces = str => /^\s+$/.test(str);

function AddressTypeahead({
  currentQuery,
  geolocateUser,
  inputRef,
  onClearClick,
  onChange,
}) {
  const [inputValue, setInputValue] = useState(null);
  const { locationChanged, searchString, geolocationInProgress } = currentQuery;
  const [, setIsFocused] = useState(false);
  const [defaultSelectedItem, setDefaultSelectedItem] = useState(null);
  const [options, setOptions] = useState([]);
  const [showAddressError, setShowAddressError] = useState(false);

  const inputClearClick = useCallback(
    () => {
      setInputValue('');
      // setting to null causes the the searchString to be used, because of a useEffect below
      // so we set it to a non-existent object
      setDefaultSelectedItem({ toDisplay: '', id: '' });
      setOptions([]);
      onClearClick?.(); // clears searchString in redux
    },
    [onClearClick],
  );

  const inputValueClearOnly = () => {
    setInputValue('');
  };

  const handleOnSelect = selectedItem => {
    // This selects the WHOLE item not just the text to display giving you access to all it's data
    if (!selectedItem || selectedItem.disabled) {
      // just do nothing if it's disabled -- could also clear the input or do whatever
      return;
    }
    setDefaultSelectedItem(selectedItem);
    setInputValue(selectedItem.toDisplay);
    onChange({
      searchString: onlySpaces(selectedItem.toDisplay)
        ? selectedItem.toDisplay.trim()
        : selectedItem.toDisplay,
    });
  };

  /**
   * updateSearch
   * @param {string} term
   * @returns {void}
   * updateSearch is not called directly but debounced below
   */
  const updateSearch = term => {
    const trimmedTerm = term?.trim();
    if (trimmedTerm === searchString?.trim()) {
      return; // already have the values
    }
    if (trimmedTerm.length > MIN_SEARCH_CHARS) {
      // fetch results and set options
      searchAddresses(trimmedTerm).then(features => {
        if (!features) {
          setOptions([]);
        }
        setOptions([
          ...features.map(feature => ({
            ...feature,
            toDisplay: feature.place_name || trimmedTerm,
          })),
        ]);
      });
    }
  };

  const handleGeolocationButtonClick = e => {
    e.preventDefault();
    recordEvent({
      event: 'fl-get-geolocation',
    });
    onChange({ searchString: '' });
    geolocateUser();
  };

  const debouncedUpdateSearch = vaDebounce(500, updateSearch);

  const onBlur = e => {
    // happens when the input is blurred
    const { value } = e.target;
    onChange({ searchString: value?.trim() || '' });
  };

  const handleInputChange = e => {
    // This way no Downshift odd input changes when selecting an address from the options
    const { value } = e.target;
    setInputValue(value);

    if (!value?.trim()) {
      onClearClick();
      return;
    }

    setShowAddressError(false);
    debouncedUpdateSearch(value);
  };

  useEffect(
    () => {
      // If the location is changed, and there is no value in searchString or inputValue then show the error
      setShowAddressError(
        locationChanged &&
          !geolocationInProgress &&
          !searchString?.length &&
          inputValue === '', // not null but empty string (null on start)
      );
    },
    [locationChanged, geolocationInProgress, searchString, inputValue],
  );

  useEffect(
    () => {
      // Sets the inputValue on load to the searchString if there is one
      if (inputValue === null && searchString) {
        setInputValue(searchString);
      }
    },
    [searchString, inputValue],
  );

  /* eslint-disable prettier/prettier */
  return (
    <Typeahead
      inputValue={inputValue || ''}
      onInputValueChange={handleInputChange}
      defaultSelectedItem={defaultSelectedItem || null}
      handleOnSelect={handleOnSelect}
      label={(
        <>
          <span id="city-state-zip-text">City, state or postal code</span>{' '}
          <span className="form-required-span">(*Required)</span>
        </>
      )}
      options={options}
      downshiftInputProps={{
        // none are required
        id: 'street-city-state-zip', // not required to provide an id
        onFocus: () => setIsFocused(true), // not required
        onBlur, // override the onBlur to handle that we want to keep the data and update the search in redux
        disabled: false,
        autoCorrect: 'off',
        spellCheck: 'false',
      }}
      inputClearClick={inputClearClick}
      inputValueClearOnly={inputValueClearOnly}
      inputError={<AddressInputError showError={showAddressError || false} />}
      showError={showAddressError}
      inputId="street-city-state-zip"
      inputRef={inputRef}
      labelSibling={(
        <UseMyLocation
          onClick={handleGeolocationButtonClick}
          geolocationInProgress={currentQuery.geolocationInProgress}
        />
      )}
      minCharacters={MIN_SEARCH_CHARS}
      keepDataOnBlur
      clearOnEscape={false}
      showDownCaret={false}
    />
  );
  /* eslint-enable prettier/prettier */
}

AddressTypeahead.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentQuery: PropTypes.shape({
    geolocationInProgress: PropTypes.bool,
    locationChanged: PropTypes.bool,
    searchString: PropTypes.string,
  }),
  geolocateUser: PropTypes.func,
  inputRef: PropTypes.object,
  onClearClick: PropTypes.func,
};

export default AddressTypeahead;
