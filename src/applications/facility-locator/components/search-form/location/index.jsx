import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AddressAutosuggest from './AddressAutosuggest';
import { CurrentQueryTypes } from '../../../types';

const LocationInput = ({
  currentQuery,
  facilitiesUseAddressTypeahead,
  geolocateUser,
  handleClearInput,
  handleGeolocationButtonClick,
  handleLocationBlur,
  handleQueryChange,
  locationInputFieldRef,
  onChange,
}) => {
  if (facilitiesUseAddressTypeahead) {
    return (
      <AddressAutosuggest
        geolocateUser={geolocateUser}
        inputRef={locationInputFieldRef}
        onClearClick={handleClearInput}
        onChange={onChange}
        currentQuery={currentQuery}
      />
    );
  }

  const { locationChanged, searchString, geolocationInProgress } = currentQuery;

  const showError =
    locationChanged &&
    !geolocationInProgress &&
    (!searchString || searchString.length === 0);

  return (
    <div
      className={classNames('vads-u-margin--0', {
        'usa-input-error': showError,
      })}
    >
      <div id="location-input-field">
        <label htmlFor="street-city-state-zip" id="street-city-state-zip-label">
          <span id="city-state-zip-text">City, state or postal code</span>{' '}
          <span className="form-required-span">(*Required)</span>
        </label>
        {geolocationInProgress ? (
          <div className="use-my-location-link">
            <va-icon icon="autorenew" size={3} />
            <span aria-live="assertive">Finding your location...</span>
          </div>
        ) : (
          <button
            onClick={handleGeolocationButtonClick}
            type="button"
            className="use-my-location-link"
            aria-describedby="city-state-zip-text"
          >
            <va-icon icon="near_me" size={3} />
            Use my location
          </button>
        )}
      </div>
      {showError && (
        <span className="usa-input-error-message" role="alert">
          <span className="sr-only">Error</span>
          Please fill in a city, state, or postal code.
        </span>
      )}
      <div className="input-container">
        <input
          id="street-city-state-zip"
          ref={locationInputFieldRef}
          name="street-city-state-zip"
          type="text"
          onChange={handleQueryChange}
          onBlur={handleLocationBlur}
          value={searchString}
          title="Your location: Street, City, State or Postal code"
        />
        {searchString?.length > 0 && (
          <button
            aria-label="Clear your city, state or postal code"
            type="button"
            id="clear-input"
            className="clear-button"
            onClick={handleClearInput}
          >
            <va-icon icon="cancel" size={3} />
          </button>
        )}
      </div>
    </div>
  );
};

LocationInput.propTypes = {
  currentQuery: CurrentQueryTypes,
  facilitiesUseAddressTypeahead: PropTypes.bool,
  geolocateUser: PropTypes.func,
  handleClearInput: PropTypes.func,
  handleGeolocationButtonClick: PropTypes.func,
  handleLocationBlur: PropTypes.func,
  handleQueryChange: PropTypes.func,
  locationInputFieldRef: PropTypes.any,
  onChange: PropTypes.func,
};

export default LocationInput;
