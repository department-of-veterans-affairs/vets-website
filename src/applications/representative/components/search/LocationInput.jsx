import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const LocationInput = props => {
  const locationInputFieldRef = useRef(null);
  const repInputFieldRef = useRef(null);

  const {
    currentQuery,
    onChange,
    // onSubmit,
    // clearSearchText
  } = props;
  const {
    locationChanged,
    locationInputString,
    repOrganizationInputString,
    geolocationInProgress,
  } = currentQuery;

  const onlySpaces = str => /^\s+$/.test(str);

  const handleLocationChange = e => {
    onChange({
      locationInputString: onlySpaces(e.target.value)
        ? e.target.value.trim()
        : e.target.value,
    });
  };
  const handleRepOrganizationChange = e => {
    onChange({
      repOrganizationInputString: onlySpaces(e.target.value)
        ? e.target.value.trim()
        : e.target.value,
    });
  };

  const handleLocationBlur = e => {
    // force redux state to register a change
    onChange({ locationInputString: ' ' });
    handleLocationChange(e);
  };
  const handleRepOrganizationBlur = e => {
    // force redux state to register a change
    onChange({ repOrganizationInputString: ' ' });
    handleRepOrganizationChange(e);
  };

  //   const handleClearInput = () => {
  //     clearSearchText();
  //     focusElement('#street-city-state-zip');
  //   };

  const handleGeolocationButtonClick = e => {
    e.preventDefault();
    // recordEvent({
    //   event: 'fl-get-geolocation',
    // });
    // geolocateUser();
  };

  const showError =
    locationChanged &&
    !geolocationInProgress &&
    (!locationInputString || locationInputString.length === 0);
  return (
    <div className="vads-u-margin--0">
      <h3>Search for your representative:</h3>
      <div id="location-input-field">
        <label htmlFor="street-city-state-zip" id="street-city-state-zip-label">
          City, state or postal code{' '}
          <span className="form-required-span">(*Required)</span>
        </label>
        <button
          onClick={handleGeolocationButtonClick}
          type="button"
          className="use-my-location-link"
          aria-label="Use my location"
        >
          <i
            className="use-my-location-button"
            aria-hidden="true"
            role="presentation"
          />
          Use my location
        </button>
        {/* )} */}
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
          onChange={handleLocationChange}
          onBlur={handleLocationBlur}
          value={locationInputString}
          title="Your location: Street, City, State or Postal code"
        />
        {/* {locationInput?.length > 0 && (
          <button
            aria-label="Clear your city, state or postal code"
            type="button"
            id="clear-input"
            className="fas fa-times-circle clear-button"
            // onClick={handleClearInput}
          />
        )} */}
      </div>
      <div>
        <div>
          <label
            htmlFor="representative-organization"
            id="representative-organization-label"
          >
            Organization or Representative Name{' '}
          </label>
        </div>
        <input
          id="representative-organization"
          ref={repInputFieldRef}
          name="representative-organization"
          type="text"
          onChange={handleRepOrganizationChange}
          onBlur={handleRepOrganizationBlur}
          value={repOrganizationInputString}
          title="Organization or Representative Name"
        />
      </div>
    </div>
  );
};

export default LocationInput;

// locationChanged,
// locationInputString,
// repOrganizationInputString,
// geolocationInProgress,

LocationInput.propTypes = {
  currentQuery: PropTypes.object.isRequired,
  locationChanged: PropTypes.bool.isRequired,
  locationInputString: PropTypes.string.isRequired,
  repOrganizationInputString: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
