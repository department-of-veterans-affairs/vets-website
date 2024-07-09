import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import {
  FETCH_STATUS,
  FACILITY_SORT_METHODS,
  GA_PREFIX,
} from '../../../utils/constants';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import LoadProvidersErrorAlert from './LoadProvidersErrorAlert';
import NoProvidersAlert from './NoProvidersAlert';
import ProviderSortVariant from './ProviderSortVariant';

export default function ProviderList({
  checkedProvider,
  idSchema,
  initialProviderDisplayCount,
  onChange,
  providersListLength,
  setCheckedProvider,
  setProvidersListLength,
  setShowProvidersList,
  showProvidersList,
}) {
  const {
    communityCareProviderList,
    requestLocationStatus,
    requestStatus,
    sortMethod,
    typeOfCareName,
  } = useSelector(selectProviderSelectionInfo, shallowEqual);

  const requestLocationFailed = requestStatus === FETCH_STATUS.failed;
  const loadingProviders = !communityCareProviderList && !requestLocationFailed;

  const loadingLocations = requestLocationStatus === FETCH_STATUS.loading;

  useEffect(
    () => {
      if (
        showProvidersList &&
        providersListLength > initialProviderDisplayCount
      ) {
        scrollAndFocus(
          `#${idSchema.$id}_${providersListLength -
            initialProviderDisplayCount +
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
      } else if (
        showProvidersList &&
        !loadingProviders &&
        requestStatus === FETCH_STATUS.failed
      ) {
        scrollAndFocus('#providerSelectionFailed');
      } else if (showProvidersList && !loadingProviders && !loadingLocations) {
        scrollAndFocus('#providerSelectionHeader');
      }
    },
    [loadingProviders, loadingLocations],
  );
  const currentlyShownProvidersList = communityCareProviderList?.slice(
    0,
    providersListLength,
  );
  const notLoading = !loadingProviders && !loadingLocations;

  const sortByDistanceFromCurrentLocation =
    sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation;
  const requestingLocationFailed =
    requestLocationStatus === FETCH_STATUS.failed;
  const displayProviderList =
    notLoading && !!currentlyShownProvidersList && !requestingLocationFailed;
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 medium-screen:vads-u-padding--3">
      <h2
        id="providerSelectionHeader"
        className="vads-u-font-size--h3 vads-u-margin-top--0"
      >
        {typeOfCareName} providers
      </h2>
      <ProviderSortVariant
        currentlyShownProvidersList={currentlyShownProvidersList}
        notLoading={notLoading}
      />
      {loadingProviders &&
        !loadingLocations && (
          <div className="vads-u-padding-bottom--2">
            <va-loading-indicator message="Loading the list of providers." />
          </div>
        )}
      {loadingLocations && (
        <div className="vads-u-padding-bottom--2">
          <va-loading-indicator message="Finding your location. Be sure to allow your browser to find your current location." />
        </div>
      )}
      {requestLocationFailed && (
        <div className="vads-u-padding-bottom--2">
          <LoadProvidersErrorAlert />
        </div>
      )}
      {displayProviderList && (
        <>
          {currentlyShownProvidersList.length === 0 && (
            <NoProvidersAlert
              sortMethod={sortMethod}
              typeOfCareName={typeOfCareName}
            />
          )}
          {currentlyShownProvidersList.length > 0 && (
            <>
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
                        {provider.address.city}, {provider.address.state}
                      </span>
                      <span className="vads-u-display--block vads-u-font-size--sm">
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
                        Select provider
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
                  className="additional-info-button usa-button-secondary vads-u-display--block vads-u-margin-right--2"
                  onClick={() => {
                    setProvidersListLength(
                      providersListLength + initialProviderDisplayCount,
                    );
                    recordEvent({
                      event: `${GA_PREFIX}-provider-list-paginate`,
                    });
                  }}
                >
                  <span className="sr-only">show</span>
                  <span>
                    Show{' '}
                    {Math.min(
                      communityCareProviderList.length - providersListLength,
                      initialProviderDisplayCount,
                    )}{' '}
                    more provider
                    {Math.min(
                      communityCareProviderList.length - providersListLength,
                      initialProviderDisplayCount,
                    ) > 1
                      ? 's'
                      : ''}
                  </span>
                </button>
              </>
            )}
            {communityCareProviderList?.length > 0 && (
              <button
                type="button"
                className="vaos-appts__cancel-btn usa-button-secondary vads-u-margin-right--0 vads-u-flex--0"
                onClick={() => {
                  setProvidersListLength(initialProviderDisplayCount);
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
