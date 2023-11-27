import React from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import classNames from 'classnames';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RepTypeSelector from './RepTypeSelector';

const SearchControls = props => {
  const {
    currentQuery,
    onChange,
    geolocateUser,
    onSubmit,
    clearGeocodeError,
    // clearSearchText
  } = props;
  const {
    locationInputString,
    repOrganizationInputString,
    representativeType,
    geolocationInProgress,
    isErrorEmptyInput,
    geocodeError,
  } = currentQuery;

  const onlySpaces = str => /^\s+$/.test(str);

  const showEmptyError = isErrorEmptyInput && !geolocationInProgress;
  const showGeolocationError = geocodeError && !geolocationInProgress;

  const handleSearchButtonClick = e => {
    e.preventDefault();
    // const {
    //   representativeType,
    //   isValid,
    // } = currentQuery;

    if (!locationInputString) {
      onChange({ locationInputString: '' });
      focusElement('.location-input-container');
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
    clearGeocodeError();
  };
  const handleRepOrganizationChange = e => {
    onChange({
      repOrganizationInputString: onlySpaces(e.target.value)
        ? e.target.value.trim()
        : e.target.value,
    });
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
      <VaModal
        modalTitle={
          currentQuery.geocodeError === 1
            ? 'We need to use your location'
            : "We couldn't locate you"
        }
        onCloseEvent={() => clearGeocodeError()}
        status="warning"
        visible={currentQuery.geocodeError > 0}
        uswds
      />
      <form id="representative-search-controls" onSubmit={e => onSubmit(e)}>
        <div className="usa-width-two-thirds">
          <h3 className="vads-u-margin-bottom--0">
            Search for a representative
          </h3>
          <div className="location-input-container">
            <div
              className={classNames('use-my-location-button-container', {
                'use-my-location-button-container-error':
                  showEmptyError || showGeolocationError,
              })}
            >
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
            <va-text-input
              error={(() => {
                if (showEmptyError) {
                  return 'Please fill in a city, state or postal code.';
                }
                if (showGeolocationError) {
                  return 'Please enter a valid location.';
                }
                return null;
              })()}
              hint={null}
              id="street-city-state-zip"
              label="City, State or Postal code"
              message-aria-describedby="Text input for location"
              name="City, State or Postal code"
              onInput={handleLocationChange}
              value={locationInputString}
              uswds
              required
            />
          </div>

          <RepTypeSelector
            representativeType={representativeType}
            onChange={onChange}
          />

          <va-text-input
            hint={null}
            label={
              representativeType === 'Veteran Service Organization (VSO)'
                ? 'Organization name'
                : 'Representative name'
            }
            message-aria-describedby="Text input for organization or representative name"
            name="Organization or Representative Name"
            onChange={handleRepOrganizationChange}
            onInput={handleRepOrganizationChange}
            value={repOrganizationInputString}
            uswds
          />

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
  clearGeocodeError: PropTypes.func,
  geolocateUser: PropTypes.func.isRequired,
  locationChanged: PropTypes.bool.isRequired,
  locationInputString: PropTypes.string.isRequired,
  repOrganizationInputString: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchControls;
