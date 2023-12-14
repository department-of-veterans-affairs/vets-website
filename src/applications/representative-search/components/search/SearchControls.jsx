import React from 'react';
import PropTypes from 'prop-types';
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
    repOfficerInputString,
    representativeType,
    geolocationInProgress,
    isErrorEmptyInput,
    geocodeError,
  } = currentQuery;

  const onlySpaces = str => /^\s+$/.test(str);

  const showEmptyError = isErrorEmptyInput && !geolocationInProgress;
  const showGeolocationError = geocodeError && !geolocationInProgress;

  const handleLocationChange = e => {
    onChange({
      locationInputString: onlySpaces(e.target.value)
        ? e.target.value.trim()
        : e.target.value,
    });
    clearGeocodeError();
  };
  const handleRepOfficerChange = e => {
    onChange({
      repOfficerInputString: onlySpaces(e.target.value)
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
          <h2 className="vads-u-margin-bottom--0" style={{ fontSize: '20px' }}>
            Search for an accredited representative
          </h2>
          <div className="location-input-container">
            <va-text-input
              style={{ order: 1 }}
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
              label="City, state or postal code"
              message-aria-describedby="Text input for location"
              name="City, state or postal code"
              onInput={handleLocationChange}
              onKeyPress={e => {
                if (e.key === 'Enter') onSubmit();
              }}
              value={locationInputString}
              uswds
              required
            />
            <div
              className={classNames('use-my-location-button-container', {
                'use-my-location-button-container-error':
                  showEmptyError || showGeolocationError,
              })}
            >
              {geolocationInProgress ? (
                <div
                  className="finding-your-location-loading"
                  style={{ order: 2 }}
                >
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
                  style={{ order: 2 }}
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
              representativeType === 'officer'
                ? 'Officer name'
                : 'Accredited representative name'
            }
            message-aria-describedby="Text input for officer or Accredited representative name"
            name="Officer or Accredited Representative Name"
            onChange={handleRepOfficerChange}
            onInput={handleRepOfficerChange}
            onKeyPress={e => {
              if (e.key === 'Enter') onSubmit();
            }}
            value={repOfficerInputString}
            uswds
          />

          <button
            id="representative-search"
            type="submit"
            value="Search"
            onClick={e => {
              e.preventDefault();
              onSubmit();
            }}
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
  repOfficerInputString: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchControls;
