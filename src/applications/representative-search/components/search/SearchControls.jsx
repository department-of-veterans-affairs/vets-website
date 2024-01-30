import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RepTypeSelector from './RepTypeSelector';
import { ErrorTypes } from '../../constants';

/* eslint-disable @department-of-veterans-affairs/prefer-button-component */

const SearchControls = props => {
  const {
    currentQuery,
    onChange,
    geolocateUser,
    onSubmit,
    clearError,
    // clearSearchText
    geocodeError,
  } = props;
  const {
    locationInputString,
    representativeInputString,
    representativeType,
    geolocationInProgress,
    isErrorEmptyInput,
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
    clearError(ErrorTypes.geocodeError);
  };
  const handleRepresentativeChange = e => {
    onChange({
      representativeInputString: onlySpaces(e.target.value)
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
          geocodeError === 1
            ? 'We need to use your location'
            : "We couldn't locate you"
        }
        onCloseEvent={() => clearError(ErrorTypes.geocodeError)}
        status="warning"
        visible={geocodeError > 0}
        uswds
      >
        <p>
          Please enable location sharing in your browser to use this feature.
        </p>
      </VaModal>
      <form id="representative-search-controls" onSubmit={e => onSubmit(e)}>
        <div className="usa-width-two-thirds">
          <h2 className="vads-u-margin-bottom--0" style={{ fontSize: '20px' }}>
            Search for a VSO or accredited attorney
          </h2>
          <div className="vads-u-margin-y--2">
            <va-additional-info trigger="What does a VSO do?" uswds>
              <p>
                <strong>Veterans Service Officers (VSOs)</strong> can help you
                gather evidence, file claims, and request decision reviews. They
                can also communicate with VA on your behalf. VSOs provide free
                services for Veterans and their families.
              </p>
              <br />
              <p>
                VSOs work for Veterans Service Organizations, like the American
                Legion, Disabled American Veterans, and Veterans of Foreign
                Wars. They have completed training and passed tests about VA
                claims and benefits.
              </p>
            </va-additional-info>
          </div>

          <va-additional-info
            trigger="What does an accredited attorney do?"
            uswds
          >
            <p>
              <strong>Accredited attorneys</strong> usually work on decision
              reviews and cases that require legal knowledge. They can charge
              fees for their services.
            </p>
            <br />
            <p>
              Accredited attorneys don’t have to take a test about VA claims and
              benefits. But they have to be a member in good standing of the bar
              association.
            </p>
          </va-additional-info>
          <RepTypeSelector
            representativeType={representativeType}
            onChange={onChange}
          />
          <div className="location-input-container">
            <va-text-input
              style={{ order: 1 }}
              error={(() => {
                if (showEmptyError) {
                  return 'Please fill in a city, state, postal code or address.';
                }
                if (showGeolocationError) {
                  return 'Please enter a valid location.';
                }
                return null;
              })()}
              hint={null}
              id="street-city-state-zip"
              label="City, state, postal code or address"
              message-aria-describedby="Text input for location"
              name="City, state, postal code or address"
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

          <va-text-input
            hint={null}
            label="Name of VSO or accredited attorney"
            name="Name of VSO or accredited attorney"
            onChange={handleRepresentativeChange}
            onInput={handleRepresentativeChange}
            onKeyPress={e => {
              if (e.key === 'Enter') onSubmit();
            }}
            value={representativeInputString}
            uswds
          />

          <div className="vads-u-margin-y--4">
            <va-button
              onClick={e => {
                e.preventDefault();
                onSubmit();
              }}
              text="Search"
              uswds
            />
          </div>
        </div>
      </form>
    </div>
  );
};

SearchControls.propTypes = {
  clearError: PropTypes.func,
  currentQuery: PropTypes.object,
  geocodeError: PropTypes.object,
  geolocateUser: PropTypes.func,
  locationChanged: PropTypes.bool,
  locationInputString: PropTypes.string,
  representativeInputString: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default SearchControls;
