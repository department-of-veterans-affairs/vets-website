import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { geoLocateUser } from '../../actions/geoLocateUser';
import { setLocationInput } from '../../actions/index';
import { convertLocation } from '../../utils/mapbox';

const SearchControls = props => {
  const {
    onSubmit,
    locateUser,
    geolocationInProgress,
    userCoordinates,
    searchQuery,
    geoCodeError,
    searchTitle,
    searchHint,
    hasSearchInput,
  } = props;

  const [queryState, setQueryState] = useState(searchQuery);
  const [inputError, setInputError] = useState(false);
  const onlySpaces = str => /^\s+$/.test(str);
  const dispatch = useDispatch();

  const handleQueryChange = e => {
    const q = e.target.value;

    // Prevent users from entering spaces because this will not trigger a change when they exit the field
    setQueryState(onlySpaces(q) ? q.trim() : q);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (queryState) {
      dispatch(setLocationInput(queryState));
      onSubmit(queryState);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const handleGeolocationButtonClick = async e => {
    e.preventDefault();
    dispatch(geoLocateUser());
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(
    () => {
      const getLocation = async () => {
        if (userCoordinates.length && !geoCodeError) {
          const place = await convertLocation(userCoordinates);
          setQueryState(place.place_name);
          dispatch(setLocationInput(place.place_name));
          await locateUser(userCoordinates);
        }
      };
      getLocation();
    },
    [userCoordinates],
  );

  const renderLocationInputField = () => {
    return (
      <div>
        <div id="location-input-field">
          <label
            htmlFor="street-city-state-zip"
            id="street-city-state-zip-label"
          >
            {searchTitle}
            <span className="form-required-span">(*Required)</span>
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
        {(geoCodeError || hasSearchInput || inputError) && (
          <span className="usa-input-error-message" role="alert">
            <span className="sr-only">Error</span>
            Please fill in a city or facility name.
          </span>
        )}
        {searchHint && <p className="search-hint-text">{searchHint}</p>}
        <div className="search-input">
          <input
            className="usa-input"
            id="street-city-state-zip"
            name="street-city-state-zip"
            type="search"
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            value={queryState}
            title="Your location: Street, City, State or Postal code"
          />
          <button type="button" id="facility-search" onClick={handleSubmit}>
            <span className="button-text">Search</span>
            <span className="button-icon">
              <va-icon icon="search" size={3} />
            </span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="search-controls-container clearfix">
      <div id="facility-search-controls">
        <div className="columns vads-u-padding-0">
          {renderLocationInputField()}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    userCoordinates: state.askVA.currentUserLocation,
    searchQuery: state.askVA.searchLocationInput,
    geolocationInProgress: state.askVA.getLocationInProgress,
    geoCodeError: state.askVA.getLocationError,
  };
}

SearchControls.propTypes = {
  geoCodeError: PropTypes.bool,
  geolocationInProgress: PropTypes.bool,
  hasSearchInput: PropTypes.bool,
  locateUser: PropTypes.func,
  searchHint: PropTypes.string,
  searchQuery: PropTypes.string,
  searchTitle: PropTypes.string,
  userCoordinates: PropTypes.arrayOf(PropTypes.number),
  onSubmit: PropTypes.func,
};

export default connect(mapStateToProps)(SearchControls);
