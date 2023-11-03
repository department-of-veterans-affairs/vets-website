import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import RepTypeSelector from './RepTypeSelector';

const SearchControls = props => {
  const locationInputFieldRef = useRef(null);
  const repInputFieldRef = useRef(null);

  const {
    currentQuery,
    onChange,
    geolocateUser,
    onSubmit,
    // clearSearchText
  } = props;
  const {
    // locationChanged,
    locationInputString,
    repOrganizationInputString,
    representativeType,
    geolocationInProgress,
  } = currentQuery;

  const onlySpaces = str => /^\s+$/.test(str);

  const handleSearchButtonClick = e => {
    e.preventDefault();
    // const {
    //   representativeType,
    //   isValid,
    // } = currentQuery;

    if (!locationInputString) {
      onChange({ locationInputString: '' });
      focusElement('#street-city-state-zip');
      return;
    }

    // if (!isValid) {
    //   return;
    // }

    // Report event here to only send analytics event when a user clicks on the button
    // recordEvent({
    //   event: 'fl-search',
    //   'fl-search-fac-type': facilityType,
    //   'fl-search-svc-type': analyticsServiceType,
    // });

    onSubmit();
  };

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

  const handleGeolocationButtonClick = e => {
    e.preventDefault();
    // recordEvent({
    //   event: 'fl-get-geolocation',
    // });
    geolocateUser();
  };

  return (
    <div className="search-controls-container clearfix vads-u-margin-bottom--neg2">
      <form id="representative-search-controls" onSubmit={e => onSubmit(e)}>
        <div className="usa-width-two-thirds">
          <h3 style={{ marginBottom: '1em' }}>Search for a representative</h3>
          <div className="location-input-container">
            <div className="location-input-header">
              <label
                htmlFor="street-city-state-zip"
                id="street-city-state-zip-label"
                className="vads-u-margin-top--2"
              >
                City, state or postal code{' '}
                <span className="form-required-span">(*Required)</span>
              </label>
            </div>

            <input
              id="street-city-state-zip"
              className="vads-u-margin-top--2"
              ref={locationInputFieldRef}
              name="street-city-state-zip"
              type="text"
              onChange={handleLocationChange}
              onBlur={handleLocationBlur}
              value={locationInputString}
              title="Your location: Street, City, State or Postal code"
            />
            <div className="use-my-location-button-container">
              {geolocationInProgress ? (
                <div className="finding-your-location-loading">
                  <i
                    className="fa fa-spinner fa-spin use-my-location-icon"
                    aria-hidden="true"
                    role="presentation"
                  />
                  <span aria-live="assertive"> Finding your location...</span>
                </div>
              ) : (
                <button
                  onClick={handleGeolocationButtonClick}
                  type="button"
                  className="use-my-location-button"
                  aria-label="Use my location"
                >
                  <i
                    className="use-my-location-icon"
                    aria-hidden="true"
                    role="presentation"
                  />
                  <div className="button-text">Use my location</div>
                </button>
              )}
            </div>
          </div>

          <RepTypeSelector
            representativeType={representativeType}
            onChange={onChange}
          />

          <div>
            <div>
              <label
                htmlFor="representative-organization"
                id="representative-organization-label"
              >
                {representativeType === 'Veteran Service Organization (VSO)'
                  ? 'Organization'
                  : 'Representative'}{' '}
                name{' '}
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

          <button
            id="representative-search"
            type="submit"
            value="Search"
            onClick={handleSearchButtonClick}
          >
            <i className="fas fa-search" /> Search
          </button>
        </div>
      </form>
    </div>
  );
};

SearchControls.propTypes = {
  currentQuery: PropTypes.object.isRequired,
  geolocateUser: PropTypes.func.isRequired,
  locationChanged: PropTypes.bool.isRequired,
  locationInputString: PropTypes.string.isRequired,
  repOrganizationInputString: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchControls;
