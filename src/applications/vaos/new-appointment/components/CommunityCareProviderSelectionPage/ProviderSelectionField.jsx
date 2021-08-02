import React, { useEffect, useState } from 'react';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import ResidentialAddress from '../../../components/ResidentialAddress';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import {
  FETCH_STATUS,
  FACILITY_SORT_METHODS,
  GA_PREFIX,
} from '../../../utils/constants';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import recordEvent from 'platform/monitoring/record-event';
import NoProvidersAlert from './NoProvidersAlert';
import LoadProvidersErrorAlert from './LoadProvidersErrorAlert';
import SelectedProvider from './SelectedProvider';
import InfoAlert from '../../../components/InfoAlert';

const INITIAL_PROVIDER_DISPLAY_COUNT = 5;

function ProviderSelectionField({
  typeOfCareName,
  address,
  formData,
  onChange,
  idSchema,
  requestStatus,
  requestLocationStatus,
  requestProvidersList,
  communityCareProviderList,
  updateCCProviderSortMethod,
  currentLocation,
  sortMethod,
}) {
  const [checkedProvider, setCheckedProvider] = useState(false);
  const [showRemoveProviderModal, setShowRemoveProviderModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showProvidersList, setShowProvidersList] = useState(false);
  const [providersListLength, setProvidersListLength] = useState(
    INITIAL_PROVIDER_DISPLAY_COUNT,
  );
  const currentlyShownProvidersList = communityCareProviderList?.slice(
    0,
    providersListLength,
  );
  const loadingProviders =
    !communityCareProviderList && requestStatus !== FETCH_STATUS.failed;

  const loadingLocations = requestLocationStatus === FETCH_STATUS.loading;

  const providerSelected = 'id' in formData;
  const sortByDistanceFromResidential =
    !sortMethod || sortMethod === FACILITY_SORT_METHODS.distanceFromResidential;

  const sortByDistanceFromCurrentLocation =
    sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(
    () => {
      if (sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation) {
        requestProvidersList(currentLocation);
      } else {
        requestProvidersList(address);
      }

      if (communityCareProviderList) {
        scrollAndFocus('#providerSelectionHeader');
      }
    },
    [sortMethod],
  );

  useEffect(
    () => {
      if (showProvidersList) {
        scrollAndFocus('#providerSelectionHeader');
      } else if (mounted && !providerSelected) {
        scrollAndFocus('.va-button-link');
      } else if (mounted) {
        scrollAndFocus('#providerPostSelectionHeader');
      }
    },
    [showProvidersList],
  );

  useEffect(
    () => {
      if (mounted && Object.keys(formData).length === 0) {
        scrollAndFocus('.va-button-link');
      }
    },
    [formData],
  );

  useEffect(
    () => {
      if (
        showProvidersList &&
        providersListLength > INITIAL_PROVIDER_DISPLAY_COUNT
      ) {
        scrollAndFocus(
          `#${idSchema.$id}_${providersListLength -
            INITIAL_PROVIDER_DISPLAY_COUNT +
            1}`,
        );
      }
    },
    [providersListLength],
  );

  useEffect(
    () => {
      if (showProvidersList && (loadingProviders || loadingLocations)) {
        scrollAndFocus('.loading-indicator');
      } else if (
        showProvidersList &&
        !loadingProviders &&
        requestLocationStatus === FETCH_STATUS.failed
      ) {
        scrollAndFocus('#providerSelectionBlockedLocation');
      } else if (showProvidersList && !loadingProviders && !loadingLocations) {
        scrollAndFocus('#providerSelectionHeader');
      }
    },
    [loadingProviders, loadingLocations],
  );

  if (!showProvidersList) {
    return (
      <SelectedProvider
        address={address}
        formData={formData}
        initialProviderDisplayCount={INITIAL_PROVIDER_DISPLAY_COUNT}
        onChange={onChange}
        providerSelected={providerSelected}
        setCheckedProvider={setCheckedProvider}
        setProvidersListLength={setProvidersListLength}
        setShowProvidersList={setShowProvidersList}
        setShowRemoveProviderModal={setShowRemoveProviderModal}
        showRemoveProviderModal={showRemoveProviderModal}
        sortMethod={sortMethod}
      />
    );
  }

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 medium-screen:vads-u-padding--3">
      <h2
        id="providerSelectionHeader"
        className="vads-u-font-size--h3 vads-u-margin-top--0"
      >
        Choose a provider
      </h2>
      {!loadingLocations &&
        sortByDistanceFromResidential && (
          <>
            {requestLocationStatus !== FETCH_STATUS.failed && (
              <>
                <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
                  You can choose a provider based on your address on file. Or
                  you can{' '}
                  <span>
                    <button
                      type="button"
                      className="va-button-link"
                      onClick={() => {
                        updateCCProviderSortMethod(
                          FACILITY_SORT_METHODS.distanceFromCurrentLocation,
                        );
                      }}
                    >
                      use your current location
                    </button>
                    .
                  </span>
                </p>
                <ResidentialAddress address={address} />
              </>
            )}
            {requestLocationStatus === FETCH_STATUS.failed && (
              <>
                <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
                  You can choose a provider based on your address on file:
                </p>
                <ResidentialAddress address={address} />
                <div id="providerSelectionBlockedLocation">
                  <InfoAlert
                    status="warning"
                    headline="Your browser is blocked from finding your current location."
                    className="vads-u-background-color--gold-lightest vads-u-font-size--base"
                    level="3"
                  >
                    <>
                      <p>
                        Make sure your browser’s location feature is turned on.
                      </p>

                      <button
                        className="va-button-link"
                        onClick={() =>
                          updateCCProviderSortMethod(
                            FACILITY_SORT_METHODS.distanceFromCurrentLocation,
                          )
                        }
                      >
                        Retry searching based on current location
                      </button>
                    </>
                  </InfoAlert>
                </div>
              </>
            )}
          </>
        )}
      {loadingProviders && (
        <div className="vads-u-padding-bottom--2">
          <LoadingIndicator message="Loading the list of providers." />
        </div>
      )}
      {loadingLocations && (
        <div className="vads-u-padding-bottom--2">
          <LoadingIndicator message="Finding your location. Be sure to allow your browser to find your current location." />
        </div>
      )}
      {requestStatus === FETCH_STATUS.failed && (
        <div className="vads-u-padding-bottom--2">
          <LoadProvidersErrorAlert />
        </div>
      )}
      {!loadingProviders &&
        !loadingLocations &&
        !!currentlyShownProvidersList && (
          <>
            {sortByDistanceFromCurrentLocation && (
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
                You can choose a provider based on your current location. Or you
                can{' '}
                <button
                  type="button"
                  className="va-button-link"
                  onClick={() => {
                    updateCCProviderSortMethod(
                      FACILITY_SORT_METHODS.distanceFromResidential,
                    );
                  }}
                >
                  use your address on file
                </button>
                .
              </p>
            )}
            {currentlyShownProvidersList.length === 0 && (
              <NoProvidersAlert
                sortMethod={sortMethod}
                typeOfCareName={typeOfCareName}
              />
            )}
            {currentlyShownProvidersList.length > 0 && (
              <>
                <p
                  id="provider-list-status"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  Displaying 1 to {currentlyShownProvidersList.length} of{' '}
                  {communityCareProviderList.length} providers
                </p>
                {currentlyShownProvidersList.map((provider, providerIndex) => {
                  const { name } = provider;
                  const checked = provider.id === checkedProvider;
                  const providerPosition = providerIndex + 1;
                  return (
                    <div className="form-radio-buttons" key={provider.id}>
                      <input
                        type="radio"
                        checked={checked}
                        id={`${idSchema.$id}_${providerPosition}`}
                        name={`${idSchema.$id}`}
                        value={provider.id}
                        onChange={_ => setCheckedProvider(provider.id)}
                        disabled={loadingProviders}
                      />
                      <label htmlFor={`${idSchema.$id}_${providerPosition}`}>
                        <span className="vads-u-display--block vads-u-font-weight--bold">
                          {name}
                        </span>
                        <span className="vads-u-display--block">
                          {provider.address?.line}
                        </span>
                        <span className="vads-u-display--block">
                          {provider.address.city}, {provider.address.state}{' '}
                          {provider.address.postalCode}
                        </span>
                        <span className="vads-u-display--block vads-u-font-size--sm vads-u-font-weight--bold">
                          {provider[sortMethod]} miles
                          <span className="sr-only">
                            {' '}
                            {sortByDistanceFromCurrentLocation
                              ? 'from your current location'
                              : 'from your home address'}
                          </span>
                        </span>
                      </label>
                      {checked && (
                        <button
                          type="button"
                          onClick={() => {
                            onChange(provider);
                            setCheckedProvider();
                            setShowProvidersList(false);
                            recordEvent({
                              event: `${GA_PREFIX}-order-position-provider-selection`,
                              providerPosition,
                            });
                          }}
                        >
                          Choose provider
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
            <div className="vads-u-display--flex">
              {providersListLength < communityCareProviderList?.length && (
                <>
                  <button
                    type="button"
                    className="additional-info-button va-button-link vads-u-display--block vads-u-margin-right--2"
                    onClick={() => {
                      setProvidersListLength(
                        providersListLength + INITIAL_PROVIDER_DISPLAY_COUNT,
                      );
                      recordEvent({
                        event: `${GA_PREFIX}-provider-list-paginate`,
                      });
                    }}
                  >
                    <span className="sr-only">show</span>
                    <span className="va-button-link">
                      +{' '}
                      {Math.min(
                        communityCareProviderList.length - providersListLength,
                        INITIAL_PROVIDER_DISPLAY_COUNT,
                      )}{' '}
                      more providers
                    </span>
                  </button>
                </>
              )}
              {communityCareProviderList?.length > 0 && (
                <button
                  type="button"
                  className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
                  onClick={() => {
                    setProvidersListLength(INITIAL_PROVIDER_DISPLAY_COUNT);
                    setShowProvidersList(false);
                  }}
                  aria-label="Cancel choosing a provider"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
    </div>
  );
}

function mapStateToProps(state) {
  return selectProviderSelectionInfo(state);
}

const mapDispatchToProps = {
  requestProvidersList: actions.requestProvidersList,
  updateCCProviderSortMethod: actions.updateCCProviderSortMethod,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProviderSelectionField);
