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
    locationChanged,
    locationInputString,
    repOrganizationInputString,
    representativeType,
    geolocationInProgress,
  } = currentQuery;

  const onlySpaces = str => /^\s+$/.test(str);

  const showError =
    locationChanged &&
    !geolocationInProgress &&
    (!locationInputString || locationInputString.length === 0);

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
            <va-text-input
              error={
                showError
                  ? 'Please fill in a city, state or postal code.'
                  : null
              }
              hint={null}
              label="City, State or Postal code"
              message-aria-describedby="Text input for location"
              name="City, State or Postal code"
              onBlur={handleLocationChange}
              onInput={handleLocationBlur}
              value={locationInputString}
              uswds
              required
            />
            <div
              className={classNames('use-my-location-button-container', {
                'use-my-location-button-container-error': showError,
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
          </div>

          <RepTypeSelector
            representativeType={representativeType}
            onChange={onChange}
          />

          <va-text-input
            hint={null}
            label={
              representativeType === 'Veteran Service Organization (VSO)'
                ? 'Organization Name'
                : 'Representative Name'
            }
            message-aria-describedby="Text input for organization or representative name"
            name="Organization or Representative Name"
            onChange={handleRepOrganizationChange}
            onBlur={handleRepOrganizationBlur}
            onInput={handleLocationBlur}
            value={repOrganizationInputString}
            uswds
            required
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
