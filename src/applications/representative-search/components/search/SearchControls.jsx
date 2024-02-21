import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import RepTypeSelector from './RepTypeSelector';
import { ErrorTypes } from '../../constants';
import { searchAreaOptions } from '../../config';

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
    searchArea,
  } = currentQuery;

  const onlySpaces = str => /^\s+$/.test(str);

  const showEmptyError = isErrorEmptyInput && !geolocationInProgress;
  const showGeolocationError = geocodeError && !geolocationInProgress;

  const searchAreaSelectOptions = Object.keys(searchAreaOptions).map(
    optionKey => (
      <option key={optionKey} value={optionKey}>
        {searchAreaOptions[optionKey]}
      </option>
    ),
  );

  const handleLocationChange = e => {
    onChange({
      locationInputString: onlySpaces(e.target.value)
        ? e.target.value.trim()
        : e.target.value,
    });
    clearError(ErrorTypes.geocodeError);
  };
  const handleSearchAreaChange = e => {
    onChange({
      searchArea: onlySpaces(e.target.value)
        ? e.target.value.trim()
        : e.target.value,
    });
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

  const handleCloseLocationModal = () => {
    clearError(ErrorTypes.geocodeError);
    focusElement(`#street-city-state-zip`);
  };

  return (
    <div className="search-controls-container clearfix vads-u-margin-bottom--neg2">
      <VaModal
        modalTitle={
          geocodeError === 1
            ? 'We need to use your location'
            : "We couldn't locate you"
        }
        onCloseEvent={handleCloseLocationModal}
        status="warning"
        visible={geocodeError > 0}
        uswds
      >
        <p>
          Please enable location sharing in your browser to use this feature.
        </p>
      </VaModal>
      <h2 className="vads-u-margin-y--0">
        Search for an accredited representative
      </h2>
      <form id="representative-search-controls" onSubmit={e => onSubmit(e)}>
        <div className="additional-representative-info">
          <div className="vads-u-margin-top--2p5">
            <va-additional-info
              trigger="What does an accredited VSO do?"
              uswds
              disable-border
            >
              <p>
                <strong>An accredited Veterans Service Officer (VSO)</strong>{' '}
                can help you gather evidence, file a claim, or request a
                decision review. They can also communicate with VA on your
                behalf.
              </p>
              <br />
              <p>
                Accredited VSOs provide free services for Veterans and their
                families. They have completed training and passed tests about VA
                claims and decision reviews.
              </p>
              <br />
              <p>
                Accredited VSOs work for Veterans Service Organizations, like
                the American Legion, Disabled American Veterans, and Veterans of
                Foreign Wars.
              </p>
            </va-additional-info>
          </div>

          <div className="vads-u-margin-top--2p5">
            <va-additional-info
              trigger="What does an accredited attorney do?"
              disable-border
              uswds
            >
              <p>
                <strong>An accredited attorney</strong> usually works on
                decision reviews and cases that require legal knowledge. They
                can charge fees for their services.
              </p>
              <br />
              <p>
                Accredited attorneys don’t have to take a test about VA claims
                and decision reviews. But they have to be members in good
                standing of the bar association.
              </p>
            </va-additional-info>
          </div>

          <div className="vads-u-margin-top--2p5">
            <va-additional-info
              trigger="What does an accredited claims agent do?"
              disable-border
              uswds
            >
              <p>
                <strong>An accredited claims agent</strong> usually works on
                decision reviews. They can charge fees for their services.
              </p>
              <br />
              <p>
                Accredited claims agents don’t work for Veterans Service
                Organizations. But they have completed training and passed tests
                about VA claims and decision reviews.
              </p>
            </va-additional-info>
          </div>
        </div>

        <div className="vads-u-margin-top--4">
          <RepTypeSelector
            representativeType={representativeType}
            onChange={onChange}
          />
        </div>

        <div className="search-controls-text-inputs">
          <div className="geolocation-container vads-u-margin-top--1">
            <div className="location-input">
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
                label="Address, city, state, or postal code"
                message-aria-describedby="Text input for location"
                name="Address, city, state, or postal code"
                onInput={handleLocationChange}
                onKeyPress={e => {
                  if (e.key === 'Enter') onSubmit();
                }}
                value={locationInputString}
                uswds
                required
              />
            </div>

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

          <div className="search-area-dropdown">
            <VaSelect
              name="area"
              value={searchArea || '50'}
              label="Search area"
              onVaSelect={handleSearchAreaChange}
              uswds
            >
              {searchAreaSelectOptions}
            </VaSelect>
          </div>

          <div className="representative-name-input vads-u-margin-top--4">
            <va-text-input
              hint={null}
              label="Name of accredited representative"
              name="Name of accredited representative"
              onChange={handleRepresentativeChange}
              onInput={handleRepresentativeChange}
              onKeyPress={e => {
                if (e.key === 'Enter') onSubmit();
              }}
              value={representativeInputString}
              uswds
            />
          </div>
        </div>

        <div className="vads-u-margin-top--5 vads-u-margin-bottom--4">
          <va-button
            onClick={e => {
              e.preventDefault();
              onSubmit();
            }}
            text="Search"
            uswds
          />
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
