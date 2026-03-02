import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '~/platform/utilities/ui';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import RepTypeSelector from './RepTypeSelector';
import { ErrorTypes } from '../../constants';
import { searchAreaOptions } from '../../config';

const ORGANIZATIONS = [
  'African American PTSD Association',
  'Alabama Department of Veterans Affairs',
  'American Legion',
  'American Veterans',
  'Arizona Department of Veterans Services',
  'Arkansas Department of Veterans Affairs',
  'Armed Forces Services Corporation',
  'Blinded Veterans Association',
  'California Department of Veterans Affairs',
  'Catholic War Veterans of the USA',
  'Colorado Division of Veterans Affairs',
  'Commonwealth of the Northern Mariana Islands Division',
  'Connecticut Department of Veterans Affairs',
  'Dale K. Graham Veterans Foundation',
  'Delaware Commission of Veterans Affairs',
  'Disabled American Veterans',
  'Fleet Reserve Association',
  'Florida Department of Veterans Affairs',
  'Georgia Department of Veterans Service',
  'Gila River Indian Community Vet.&Fam. Svcs Office',
  'Green Beret Foundation',
  'Guam Office of Veterans Affairs',
  'Hawaii Office of Veterans Services',
  'IAM Veterans Benefits Support (IAM VBS)',
  'Idaho Division of Veterans Services',
  'Illinois Department of Veterans Affairs',
  'Indiana Department of Veterans Affairs',
  'Iowa Department of Veterans Affairs',
  'Jewish War Veterans of the USA',
  'Kansas Office of Veterans Services',
  'Kentucky Department of Veterans Affairs',
  'Louisiana Department of Veterans Affairs',
  "Maine Veterans' Services",
  'Marine Corps League',
  'Maryland Department of Veterans Affairs',
  'Massachusetts Executive Office of Veterans Service',
  'Michigan Veterans Affairs Agency',
  'Minnesota Department of Veterans Affairs',
  'Mississippi Veterans Affairs',
  'Missouri Veterans Commission',
  'Montana Veterans Affairs (MVAD)',
  'National Association for Black Veterans, Inc.',
  'National Association of County Veterans Service Officers',
  'National Law School Veterans Clinic Consortium',
  'National Montford Point Marine Association, Inc.',
  'National Veterans Legal Services Program',
  'Navajo Nation Veterans Administration',
  'Navy Mutual Aid Association',
  'Nebraska Department of Veterans Affairs',
  'Nevada Department of Veterans Services',
  'New Hampshire Division of Veteran Services',
  'New Jersey Department of Military and Veterans Affairs',
  'New Mexico Department of Veterans Services',
  "New York State Department of Veterans' Services",
  'North Carolina Dept Military and Veterans Affairs',
  'North Dakota Department Veterans Affairs',
  'Office of Veterans Affairs American Samoa Government',
  'Ohio Department of Veterans Services',
  'Oklahoma Department of Veterans Affairs',
  'Oregon Department of Veterans Affairs',
  'Paralyzed Veterans of America',
  'Pennsylvania Department of Military and Veterans Affairs',
  'Polish Legion of American Veterans',
  'Puerto Rico Veterans Advocate Office',
  'Rhode Island Office of Veterans Services (RIVETS)',
  'South Dakota Department of Veterans Affairs',
  'Swords to Plowshares',
  'Tennessee Department of Veterans Services',
  'Texas Veterans Commission',
  'The Retired Enlisted Association',
  'The South Carolina Department of Veterans Affairs',
  'UDT-SEAL Association',
  'Utah Department of Veterans and Military Affairs',
  'Vermont Office of Veterans Affairs',
  'Veterans of Foreign Wars',
  "Veterans' Voice of America",
  'Vietnam Veterans of America',
  'Virgin Islands Office of Veterans Affairs',
  'Virginia Department of Veterans Services',
  'Washington Department of Veterans Affairs',
  'West Virginia Dept of Veterans Assistance',
  'Wisconsin Department of Veterans Affairs',
  'Wounded Warrior Project',
  'Wyoming Veterans Commission',
];

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
    organizationFilter,
  } = currentQuery;

  const onlySpaces = str => /^\s+$/.test(str);

  const showEmptyError = isErrorEmptyInput && !geolocationInProgress;
  const showGeolocationError = geocodeError && !geolocationInProgress;

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();

  const organizationFilterEnabled = useToggleValue(
    TOGGLE_NAMES.findARepresentativeEnabled,
  );

  const searchAreaSelectOptions = Object.keys(searchAreaOptions).map(
    optionKey => (
      <option key={optionKey} value={optionKey}>
        {searchAreaOptions[optionKey]}
      </option>
    ),
  );

  const organizationSelectOptions = ORGANIZATIONS.map(organization => (
    <option key={organization} value={organization}>
      {organization}
    </option>
  ));

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
  const handleOrganizationChange = e => {
    onChange({
      organizationFilter: onlySpaces(e.target.value)
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
      <h2 className="vads-u-margin-bottom--0">
        Search for an accredited representative
      </h2>
      <form id="representative-search-controls" onSubmit={e => onSubmit(e)}>
        <RepTypeSelector
          representativeType={representativeType}
          onChange={onChange}
        />

        <div className="vads-u-margin-top--1">
          <p>
            <strong>Note:</strong> If you’re not sure what type of accredited
            representative you’d like to appoint, you can learn about the
            services they offer.
          </p>
          <p>
            <va-link
              id="accredited-representative-faqs-link"
              href="/resources/va-accredited-representative-faqs/"
              text="Learn about the types of accredited representatives"
              external // Enables behavior of opening in a new tab
            />
          </p>
        </div>

        <div className="search-controls-text-inputs">
          <div className="geolocation-container">
            <div className="location-input">
              <va-text-input
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
              >
                <div
                  className={classNames('use-my-location-button-container', {
                    'use-my-location-button-container-error':
                      showEmptyError || showGeolocationError,
                  })}
                >
                  {geolocationInProgress ? (
                    <div className="finding-your-location-loading">
                      <va-icon icon="autorenew" size={3} />
                      <span aria-live="assertive">
                        Finding your location...
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleGeolocationButtonClick}
                      type="button"
                      className="use-my-location-link"
                      aria-label="Use my location"
                    >
                      <va-icon size={3} icon="near_me" aria-hidden="true" />
                      Use my location
                    </button>
                  )}
                </div>
              </va-text-input>
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
          {organizationFilterEnabled &&
            representativeType === 'veteran_service_officer' && (
              <div className="organization-select">
                <VaSelect
                  name="organization"
                  value={organizationFilter}
                  label="Veterans Service Organization (VSO)"
                  onVaSelect={handleOrganizationChange}
                  uswds
                >
                  {organizationSelectOptions}
                </VaSelect>
              </div>
            )}
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
            big
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
