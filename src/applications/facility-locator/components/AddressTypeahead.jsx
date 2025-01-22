import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import vaDebounce from 'platform/utilities/data/debounce';
import recordEvent from 'platform/monitoring/record-event';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import TypeaheadDropdownOptions, {
  toDisplay,
} from './TypeaheadDropdownOptions';
import UseMyLocation from './UseMyLocation';
import AddressInputError from './AddressInputError';
import InputWithClear from './InputWithClear';

const MIN_SEARCH_CHARS = 3;

function AddressTypeahead({
  currentQuery,
  geolocateUser,
  inputRef,
  onClearClick,
}) {
  const { locationChanged, searchString, geolocationInProgress } = currentQuery;
  const [, setIsFocused] = useState(false);
  const [defaultSelectedItem, setDefaultSelectedItem] = useState(searchString);
  const [touched, setTouched] = useState(false);
  const [, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [, setSelectedItem] = useState(null);

  const showAddressError = useMemo(
    () => {
      return (
        touched &&
        locationChanged &&
        !geolocationInProgress &&
        (!searchString || searchString.length === 0)
      );
    },
    [locationChanged, touched, searchString, geolocationInProgress],
  );

  useEffect(
    () => {
      if (!defaultSelectedItem && searchString) {
        setDefaultSelectedItem(searchString);
      }
    },
    [defaultSelectedItem, searchString],
  );

  const handleOnSelect = selectedItem => {
    setSelectedItem(selectedItem);
  };

  /**
   * updateSearch
   * @param {string} term
   * @returns {void}
   * updateSearch is not called directly but debounced below
   */
  const updateSearch = term => {
    const trimmedTerm = term.trim();
    setSearchTerm(trimmedTerm);
    if (trimmedTerm.length > MIN_SEARCH_CHARS) {
      // fetch results and set options
      setOptions([]);
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

  return (
    <Downshift
      onChange={handleOnSelect}
      selectedItem={!window.Cypress ? defaultSelectedItem : undefined}
      defaultSelectedItem={window.Cypress ? defaultSelectedItem : undefined}
      defaultInputValue={searchString || ''}
      itemToString={toDisplay}
      onInputValueChange={term => {
        setTouched(true);
        debouncedUpdateSearch(term);
      }}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getRootProps,
        isOpen,
        inputValue,
        highlightedIndex,
      }) => (
        <div id="address-typeahead-container">
          <div className="w-72 flex flex-col gap-1">
            <div id="address-typeahead-label-container">
              <label
                htmlFor="street-city-state-zip"
                id="street-city-state-zip-label"
                {...getLabelProps()}
              >
                <span id="city-state-zip-text">City, state or postal code</span>{' '}
                <span className="form-required-span">(*Required)</span>
              </label>
              <UseMyLocation
                onClick={handleGeolocationButtonClick}
                geolocationInProgress={currentQuery.geolocationInProgress}
              />
            </div>
            <AddressInputError showError={showAddressError || false} />
            <div
              className="flex shadow-sm bg-white gap-0.5"
              {...getRootProps({}, { suppressRefError: true })}
            >
              <InputWithClear
                {...getInputProps({
                  onFocus: () => setIsFocused(true),
                  disabled: false,
                  onBlur: () => setIsFocused(false),
                })}
                onClearClick={onClearClick}
                ref={inputRef}
              />

              <TypeaheadDropdownOptions
                getItemProps={getItemProps}
                highlightedIndex={highlightedIndex}
                options={options}
                isShown={
                  isOpen && !!inputValue && inputValue.length > MIN_SEARCH_CHARS
                }
              />
            </div>
          </div>
        </div>
      )}
    </Downshift>
  );
}

AddressTypeahead.propTypes = {
  currentQuery: PropTypes.shape({
    geolocationInProgress: PropTypes.bool,
    locationChanged: PropTypes.bool,
    searchString: PropTypes.string,
  }),
  geolocateUser: PropTypes.func,
  inputRef: PropTypes.object,
  onClearClick: PropTypes.func,
};

const mapDispatch = {};

const mapStateToProps = state => {
  return {
    currentQuery: state.searchQuery,
  };
};

export default connect(
  mapStateToProps,
  mapDispatch,
)(AddressTypeahead);
