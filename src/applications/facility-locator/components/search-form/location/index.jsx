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
  isMobile,
  isSmallDesktop,
  isTablet,
  locationInputFieldRef,
  onChange,
  useProgressiveDisclosure,
}) => {
  if (facilitiesUseAddressTypeahead) {
    return (
      <AddressAutosuggest
        currentQuery={currentQuery}
        geolocateUser={geolocateUser}
        inputRef={locationInputFieldRef}
        isMobile={isMobile}
        isSmallDesktop={isSmallDesktop}
        isTablet={isTablet}
        onClearClick={handleClearInput}
        onChange={onChange}
        useProgressiveDisclosure={useProgressiveDisclosure}
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
      id="location-input-container"
      className={classNames('vads-u-margin--0', {
        'usa-input-error': showError,
      })}
    >
      {/* 
          after the flipper useProgressiveDisclosure is removed,
          this id can be changed back to #location-input-field
          and the media query in it may be removed
           */}
      <div
        id={`location-input-field${
          useProgressiveDisclosure && isSmallDesktop ? '-desktop' : ''
        }`}
      >
        <label htmlFor="street-city-state-zip" id="street-city-state-zip-label">
          <span id="city-state-zip-text">
            {useProgressiveDisclosure
              ? 'Zip code or city, state'
              : 'City, state or postal code'}
          </span>{' '}
          <span className="form-required-span">(*Required)</span>
        </label>
        {geolocationInProgress ? (
          <div
            className={`use-my-location-link ${
              isSmallDesktop && useProgressiveDisclosure ? 'fl-sm-desktop' : ''
            }`}
          >
            <va-icon icon="autorenew" size={3} />
            <span aria-live="assertive">Finding your location...</span>
          </div>
        ) : (
          <button
            onClick={handleGeolocationButtonClick}
            type="button"
            className={`use-my-location-link${
              isSmallDesktop && useProgressiveDisclosure ? '-desktop' : ''
            }`}
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
          {useProgressiveDisclosure
            ? 'Enter a zip code or a city and state in the search box'
            : 'Please fill in a city, state, or postal code.'}
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
          title={
            useProgressiveDisclosure
              ? undefined // cause to be unset
              : 'Your location: Street, City, State or Postal code'
          }
        />
        {searchString?.length > 0 && (
          // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
          <button
            aria-label={
              useProgressiveDisclosure
                ? 'Clear your zip code or city, state'
                : 'Clear your city, state or postal code'
            }
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
  isMobile: PropTypes.bool,
  isSmallDesktop: PropTypes.bool,
  isTablet: PropTypes.bool,
  locationInputFieldRef: PropTypes.any,
  useProgressiveDisclosure: PropTypes.bool,
  onChange: PropTypes.func,
};

export default LocationInput;
