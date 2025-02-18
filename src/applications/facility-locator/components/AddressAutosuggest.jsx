import React, { useCallback, useEffect, useState } from 'react';
import vaDebounce from 'platform/utilities/data/debounce';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import UseMyLocation from './UseMyLocation';
import AddressInputError from './AddressInputError';
import { searchAddresses } from '../utils/mapHelpers';
import Autosuggest from './Autosuggest';

const MIN_SEARCH_CHARS = 3;
const onlySpaces = str => /^\s+$/.test(str);

function AddressAutosuggest({
  currentQuery,
  geolocateUser,
  inputRef,
  onClearClick,
  onChange,
}) {
  const [inputValue, setInputValue] = useState(null);
  const { locationChanged, searchString, geolocationInProgress } = currentQuery;
  const [selectedItem, setSelectedItem] = useState(null);
  const [options, setOptions] = useState([]);
  const [showAddressError, setShowAddressError] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const inputClearClick = useCallback(
    () => {
      onClearClick(); // clears searchString in redux
      onChange({ searchString: '' });
      setInputValue('');
      // setting to null causes the the searchString to be used, because of a useEffect below
      // so we set it to a non-existent object
      setSelectedItem(null);
      setOptions([]);
    },
    [onClearClick, onChange],
  );

  const handleOnSelect = item => {
    // This selects the WHOLE item not just the text to display giving you access to all it's data
    if (!item || item.disabled) {
      // just do nothing if it's disabled -- could also clear the input or do whatever
      return;
    }
    setSelectedItem(item);
    onChange({
      searchString: onlySpaces(item.toDisplay)
        ? item.toDisplay.trim()
        : item.toDisplay,
    });
  };

  /**
   * updateSearch
   * @param {string} term
   * @returns {void}
   * updateSearch is not called directly but debounced below
   */
  const updateSearch = term => {
    const trimmedTerm = term?.trimStart();
    if (trimmedTerm === searchString) {
      return; // already have the values
    }
    if (trimmedTerm.length >= MIN_SEARCH_CHARS) {
      // fetch results and set options
      setIsGeocoding(true);
      searchAddresses(trimmedTerm)
        .then(features => {
          if (!features) {
            setOptions([]);
          } else {
            setOptions([
              ...features.map(feature => ({
                ...feature,
                toDisplay: feature.place_name || trimmedTerm,
              })),
            ]);
          }
          setIsGeocoding(false);
        })
        .catch(() => setIsGeocoding(false));
    }
  };

  const handleGeolocationButtonClick = e => {
    e.preventDefault();
    recordEvent({
      event: 'fl-get-geolocation',
    });
    geolocateUser();
  };

  const debouncedUpdateSearch = vaDebounce(500, updateSearch);

  const onBlur = () => {
    const value = inputValue?.trimStart() || '';
    onChange({ searchString: ' ' });
    onChange({ searchString: value });
    // not expected to search when user leaves the field
  };

  const handleInputChange = e => {
    const { inputValue: value } = e;
    setInputValue(value?.trimStart());
    setIsTouched(true);

    if (!value?.trimStart()) {
      onClearClick();
      return;
    }

    debouncedUpdateSearch(value);
  };

  useEffect(
    () => {
      // If the location is changed, and there is no value in searchString or inputValue then show the error
      setShowAddressError(
        locationChanged &&
          !geolocationInProgress &&
          !searchString?.length &&
          !inputValue, // not null but empty string (null on start)
      );
    },
    [
      locationChanged,
      geolocationInProgress,
      searchString,
      inputValue,
      isTouched,
    ],
  );

  useEffect(
    () => {
      if (searchString && !geolocationInProgress) {
        setInputValue(searchString);
      }
    },
    [searchString, geolocationInProgress],
  );

  return (
    <Autosuggest
      inputValue={inputValue || ''}
      onInputValueChange={handleInputChange}
      selectedItem={selectedItem || null}
      handleOnSelect={handleOnSelect}
      /* eslint-disable prettier/prettier */
      label={(
        <>
          <span id="city-state-zip-text">Zip code or city, state</span>{' '}
          <span className="form-required-span">(*Required)</span>
        </>
      )}
      /* eslint-enable prettier/prettier */
      options={options}
      downshiftInputProps={{
        // none are required
        id: 'street-city-state-zip', // not required to provide an id
        onFocus: () => setIsTouched(true), // not required
        onBlur, // override the onBlur to handle that we want to keep the data and update the search in redux
        disabled: false,
        autoCorrect: 'off',
        spellCheck: 'false',
        onChange: e => {
          // possibly necessary if you see input jumping around
          handleInputChange({ inputValue: e.target.value });
        },
      }}
      onClearClick={inputClearClick}
      inputError={<AddressInputError showError={showAddressError || false} />}
      showError={showAddressError}
      inputId="street-city-state-zip"
      inputRef={inputRef}
      /* eslint-disable prettier/prettier */
      labelSibling={(
        <UseMyLocation
          onClick={handleGeolocationButtonClick}
          geolocationInProgress={currentQuery.geolocationInProgress}
        />
      )}
      /* eslint-enable prettier/prettier */
      minCharacters={MIN_SEARCH_CHARS}
      keepDataOnBlur
      showDownCaret={false}
      shouldShowNoResults
      isLoading={isGeocoding}
      loadingMessage="Searching..."
    />
  );
}

AddressAutosuggest.propTypes = {
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

export default AddressAutosuggest;
