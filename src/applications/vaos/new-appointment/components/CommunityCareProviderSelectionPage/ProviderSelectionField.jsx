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
import { distanceBetween } from '../../../utils/address';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import RemoveProviderModal from './RemoveProviderModal';
import recordEvent from 'platform/monitoring/record-event';
import NoProvidersAlert from './NoProvidersAlert';
import LoadProvidersErrorAlert from './LoadProvidersErrorAlert';

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
  const providersListEmpty = currentlyShownProvidersList?.length === 0;
  const loadingProviders =
    requestStatus === FETCH_STATUS.loading ||
    requestStatus === FETCH_STATUS.notStarted;

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
    },
    [sortMethod],
  );

  useEffect(
    () => {
      if (showProvidersList) {
        scrollAndFocus('h2');
      } else if (mounted) {
        scrollAndFocus('.va-button-link');
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

  return (
    <div className="vads-u-background-color--gray-lightest small-screen:vads-u-padding--2 medium-screen:vads-u-padding--3">
      {!showProvidersList &&
        !providerSelected && (
          <button
            className="va-button-link"
            type="button"
            onClick={() => {
              setShowProvidersList(true);
              recordEvent({ event: `${GA_PREFIX}-choose-provider-click` });
            }}
          >
            <i className="fas fa-plus vads-u-padding-right--0p5" />
            Choose a provider
          </button>
        )}
      {!showProvidersList &&
        providerSelected && (
          <>
            <span className="vads-u-display--block vads-u-font-weight--bold">
              {formData.name}
            </span>
            <span className="vads-u-display--block">
              {formData.address?.line}
            </span>
            <span className="vads-u-display--block">
              {formData.address?.city}, {formData.address?.state}{' '}
              {formData.address?.postalCode}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm vads-u-font-weight--bold">
              {distanceBetween(
                formData.position?.latitude,
                formData.position?.longitude,
                address.latitude,
                address.longitude,
              )}{' '}
              miles
            </span>
            <div className="vads-u-display--flex">
              <button
                type="button"
                className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0 vads-u-margin-right--2"
                onClick={() => {
                  setProvidersListLength(INITIAL_PROVIDER_DISPLAY_COUNT);
                  setShowProvidersList(true);
                }}
              >
                Change provider
              </button>
              <button
                aria-label={`Remove ${formData.name}`}
                type="button"
                className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0 vads-u-margin-right--2"
                onClick={() => {
                  setShowRemoveProviderModal(true);
                }}
              >
                Remove
              </button>
            </div>
          </>
        )}
      {showProvidersList && (
        <>
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
            Choose a provider
          </h2>
          {!loadingProviders &&
            requestLocationStatus === FETCH_STATUS.succeeded &&
            sortByDistanceFromCurrentLocation && (
              <p className="vads-u-margin-top--0">
                Providers based on your location
              </p>
            )}
          {!loadingLocations &&
            sortByDistanceFromResidential && (
              <>
                <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                  Your address on file:
                </p>
                <ResidentialAddress address={address} />
                {(requestLocationStatus === FETCH_STATUS.notStarted ||
                  requestLocationStatus === FETCH_STATUS.succeeded) && (
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
                    Or,{' '}
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
                  </p>
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
          {!loadingLocations &&
            requestLocationStatus === FETCH_STATUS.failed && (
              <div className="vads-u-padding--2 vads-u-background-color--primary-alt-lightest">
                <div className="usa-alert-body">
                  Your browser is blocked from finding your current location.
                  Make sure your browser’s location feature is turned on.
                </div>
              </div>
            )}
          {!loadingProviders &&
            !loadingLocations &&
            (requestStatus === FETCH_STATUS.succeeded ||
              requestLocationStatus === FETCH_STATUS.succeeded) && (
              <>
                {sortByDistanceFromCurrentLocation && (
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
                    Or,{' '}
                    <button
                      type="button"
                      className="va-button-link"
                      onClick={() => {
                        updateCCProviderSortMethod(
                          FACILITY_SORT_METHODS.distanceFromResidential,
                        );
                      }}
                    >
                      use your home address on file
                    </button>
                  </p>
                )}
                {providersListEmpty && (
                  <NoProvidersAlert
                    sortMethod={sortMethod}
                    typeOfCareName={typeOfCareName}
                  />
                )}
                {!providersListEmpty && (
                  <>
                    <p role="status" aria-live="polite" aria-atomic="true">
                      Displaying 1 to {currentlyShownProvidersList.length} of{' '}
                      {communityCareProviderList.length} providers
                    </p>
                    {currentlyShownProvidersList.map(
                      (provider, providerIndex) => {
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
                            <label
                              htmlFor={`${idSchema.$id}_${providerPosition}`}
                            >
                              <span className="vads-u-display--block vads-u-font-weight--bold">
                                {name}
                              </span>
                              <span className="vads-u-display--block">
                                {provider.address?.line}
                              </span>
                              <span className="vads-u-display--block">
                                {provider.address.city},{' '}
                                {provider.address.state}{' '}
                                {provider.address.postalCode}
                              </span>
                              <span className="vads-u-display--block vads-u-font-size--sm vads-u-font-weight--bold">
                                {provider[sortMethod]} miles
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
                      },
                    )}
                  </>
                )}
              </>
            )}
        </>
      )}
      {!loadingProviders &&
        !loadingLocations &&
        requestStatus === FETCH_STATUS.succeeded &&
        (requestLocationStatus === FETCH_STATUS.notStarted ||
          requestLocationStatus === FETCH_STATUS.succeeded) &&
        showProvidersList && (
          <div className="vads-u-display--flex">
            {providersListLength < communityCareProviderList.length && (
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
          </div>
        )}
      {showRemoveProviderModal && (
        <RemoveProviderModal
          provider={formData}
          address={address}
          onClose={response => {
            setShowRemoveProviderModal(false);
            if (response === true) {
              setCheckedProvider(false);
              onChange({});
            }
          }}
        />
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
