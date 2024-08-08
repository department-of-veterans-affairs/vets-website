import { focusElement } from 'platform/utilities/ui';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

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
            City or postal code{' '}
          </label>
          {geolocationInProgress ? (
            <div className="use-my-location-link">
              <va-loading-indicator
                label="Finding your location"
                message="Finding your location..."
                set-focus
              />
            </div>
          ) : (
            <button
              onClick={handleGeolocationButtonClick}
              type="button"
              className="use-my-location-link vads-u-display--flex vads-u-align-items--center"
            >
              <va-icon icon="near_me" size={3} />
              Use my location
            </button>
          )}
        </div>
        {geoCodeError && (
          <span className="usa-input-error-message" role="alert">
            <span className="sr-only">Error</span>
            Please fill in a city or postal code.
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
              className="clear-button"
              onClick={handleClearInput}
            >
              <va-icon
                icon="cancel"
                size={2}
                id="clear-input"
                onClick={handleClearInput}
              />
            </button>
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
