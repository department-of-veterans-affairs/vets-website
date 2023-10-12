import React, { useRef, useState } from 'react';

const LocationInput = () => {
  const locationInputFieldRef = useRef(null);

  const [searchString, setSearchString] = useState('');

  const onlySpaces = str => /^\s+$/.test(str);

  const onChange = e => {
    setSearchString(e.target.value);
  };

  const handleQueryChange = e => {
    // prevent users from entering only spaces
    // because this will not trigger a change
    // when they exit the field
    onChange({
      searchString: onlySpaces(e.target.value)
        ? e.target.value.trim()
        : e.target.value,
    });
  };

  const handleLocationBlur = e => {
    // force redux state to register a change
    onChange({ searchString: ' ' });
    handleQueryChange(e);
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

  // const {
  //     locationChanged,
  //     searchString,
  //     geolocationInProgress,
  //   } = currentQuery;
  //   const showError =
  //     locationChanged &&
  //     !geolocationInProgress &&
  //     (!searchString || searchString.length === 0);
  return (
    <div
    //   className={classNames('vads-u-margin--0', {
    //     'usa-input-error': showError,
    //   })}
    >
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
      {/* {showError && (
            <span className="usa-input-error-message" role="alert">
              <span className="sr-only">Error</span>
              Please fill in a city, state, or postal code.
            </span>
          )} */}
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
            className="fas fa-times-circle clear-button"
            // onClick={handleClearInput}
          />
        )}
      </div>
    </div>
  );
};

export default LocationInput;
