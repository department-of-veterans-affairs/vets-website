import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import { geoLocateUser } from '../../actions/geoLocateUser';
import { setLocationInput } from '../../actions/index';
import { convertLocation } from '../../utils/mapbox';

const SearchControls = props => {
  const {
    onSubmit,
    locateUser,
    geolocationInProgress,
    userLocation,
    searchQuery,
    geoCodeError,
  } = props;

  const [queryState, setQueryState] = useState(searchQuery);
  const onlySpaces = str => /^\s+$/.test(str);
  const dispatch = useDispatch();

  const handleQueryChange = e => {
    const q = e.target.value;

    // Prevent users from entering spaces because this will not trigger a change when they exit the field
    setQueryState(onlySpaces(q) ? q.trim() : q);
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(setLocationInput(queryState));
    onSubmit(queryState);
  };

  const handleGeolocationButtonClick = async e => {
    e.preventDefault();
    dispatch(geoLocateUser());
  };

  useEffect(
    () => {
      const getLocation = async () => {
        if (userLocation && !geoCodeError) {
          const place = await convertLocation(userLocation);
          setQueryState(place.place_name);
          dispatch(setLocationInput(place));
          await locateUser(userLocation);
        }
      };
      getLocation();
    },
    [userLocation],
  );

  const handleClearInput = () => {
    setQueryState('');
    focusElement('#street-city-state-zip');
  };

  const renderLocationInputField = () => {
    return (
      <div>
        <div id="location-input-field">
          <label
            htmlFor="street-city-state-zip"
            id="street-city-state-zip-label"
          >
            City, state or postal code{' '}
            <span className="form-required-span">(*Required)</span>
          </label>
          {geolocationInProgress ? (
            <div className="use-my-location-link">
              <i
                className="fa fa-spinner fa-spin"
                aria-hidden="true"
                role="presentation"
              />
              <span aria-live="assertive">Finding your location...</span>
            </div>
          ) : (
            <button
              onClick={handleGeolocationButtonClick}
              type="button"
              className="use-my-location-link"
            >
              <i
                className="use-my-location-button"
                aria-hidden="true"
                role="presentation"
              />
              Use my location
            </button>
          )}
        </div>
        {geoCodeError && (
          <span className="usa-input-error-message" role="alert">
            <span className="sr-only">Error</span>
            Please fill in a city, state, or postal code.
          </span>
        )}
        <div className="search-input">
          <input
            className="usa-input"
            id="street-city-state-zip"
            name="street-city-state-zip"
            type="search"
            onChange={handleQueryChange}
            value={queryState}
            title="Your location: Street, City, State or Postal code"
          />
          {queryState?.length > 0 && (
            <button
              aria-label="Clear your city, state or postal code"
              type="button"
              id="clear-input"
              className="fas fa-times-circle clear-button"
              onClick={handleClearInput}
            />
          )}
          <input
            id="facility-search"
            className="usa-button"
            onClick={handleSubmit}
            type="submit"
            value="Search"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="search-controls-container clearfix">
      <div id="facility-search-controls">
        <div className="columns">{renderLocationInputField()}</div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    userLocation: state.askVA.currentUserLocation,
    searchQuery: state.askVA.searchLocationInput,
    geolocationInProgress: state.askVA.getLocationInProgress,
    geoCodeError: state.askVA.getLocationError,
  };
}

export default connect(mapStateToProps)(SearchControls);
