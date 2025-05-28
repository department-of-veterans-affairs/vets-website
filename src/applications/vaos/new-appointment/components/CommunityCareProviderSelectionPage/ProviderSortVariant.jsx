import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { FACILITY_SORT_METHODS, FETCH_STATUS } from '../../../utils/constants';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import {
  requestProvidersList,
  updateCCProviderSortMethod,
} from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import InfoAlert from '../../../components/InfoAlert';
import NoAddressNote from '../NoAddressNote';

export default function ProviderSortVariant({
  currentlyShownProvidersList,
  notLoading,
}) {
  const dispatch = useDispatch();
  const {
    address,
    ccEnabledSystems,
    communityCareProviderList,
    currentLocation,
    requestLocationStatus,
    requestStatus,
    selectedCCFacility,
    sortMethod,
  } = useSelector(selectProviderSelectionInfo, shallowEqual);

  const [selectedSortMethod, setSelectedSortMethod] = useState(sortMethod);
  const sortOptions = [
    {
      value: FACILITY_SORT_METHODS.distanceFromCurrentLocation,
      label: 'Your current location',
    },
    ...ccEnabledSystems.map(facility => {
      return {
        value: facility.id,
        label: `${facility.address?.city}, ${facility.address?.state}`,
      };
    }),
  ];

  useEffect(
    () => {
      if (sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation) {
        dispatch(requestProvidersList(currentLocation));
      } else if (sortMethod === FACILITY_SORT_METHODS.distanceFromResidential) {
        dispatch(requestProvidersList(address));
      } else {
        dispatch(requestProvidersList(selectedCCFacility?.position));
      }

      if (communityCareProviderList) {
        scrollAndFocus('#providerSelectionHeader');
      }
    },
    [selectedCCFacility, sortMethod],
  );

  const onValueChange = option => {
    if (Object.values(FACILITY_SORT_METHODS).includes(option.detail.value)) {
      setSelectedSortMethod(option.detail.value);
      dispatch(updateCCProviderSortMethod(option.detail.value));
    } else {
      const selectedFacility = ccEnabledSystems.find(
        facility => facility.id === option.detail.value,
      );
      setSelectedSortMethod(selectedFacility.id);
      dispatch(
        updateCCProviderSortMethod(
          FACILITY_SORT_METHODS.distanceFromFacility,
          selectedFacility,
        ),
      );
    }
  };
  const hasUserAddress = address && !!Object.keys(address).length;
  const requestLocationStatusFailed =
    requestLocationStatus === FETCH_STATUS.failed;
  const requestProvidersFailed = requestStatus === FETCH_STATUS.failed;

  if (hasUserAddress) {
    sortOptions.unshift({
      value: FACILITY_SORT_METHODS.distanceFromResidential,
      label: 'Your home address',
    });
  } else {
    sortOptions.push({
      value: FACILITY_SORT_METHODS.distanceFromCurrentLocation,
      label: 'Your current location',
    });
  }

  // format optons for new component
  const options = sortOptions.map((s, i) => {
    return (
      <option key={i} value={s.value}>
        {s.label}
      </option>
    );
  });

  return (
    <div className="vads-u-margin-bottom--3">
      {notLoading &&
        !requestProvidersFailed &&
        currentlyShownProvidersList.length > 0 && (
          <p
            className="vads-u-margin--0"
            id="provider-list-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            Displaying {currentlyShownProvidersList.length} of{' '}
            {communityCareProviderList.length} providers
          </p>
        )}
      <VaSelect
        label="Show providers nearest to this location:"
        name="sort"
        onVaSelect={onValueChange}
        value={selectedSortMethod}
        data-testid="providersSelect"
        uswds
      >
        {hasUserAddress ? options : options.slice(1)}
      </VaSelect>
      {!hasUserAddress && <NoAddressNote optionType="providers" />}
      {requestLocationStatusFailed && (
        <div
          id="providerSelectionBlockedLocation"
          className="vads-u-margin-top--3"
        >
          <InfoAlert
            status="warning"
            headline="Your browser is blocked from finding your current location."
            className="vads-u-background-color--gold-lightest"
            level="3"
          >
            <>
              <p>Make sure your browser’s location feature is turned on.</p>

              <button
                className="va-button-link"
                onClick={() =>
                  dispatch(
                    updateCCProviderSortMethod(
                      FACILITY_SORT_METHODS.distanceFromCurrentLocation,
                    ),
                  )
                }
              >
                Retry searching based on current location
              </button>
            </>
          </InfoAlert>
        </div>
      )}
    </div>
  );
}

ProviderSortVariant.propTypes = {
  currentlyShownProvidersList: PropTypes.array,
  notLoading: PropTypes.bool,
};
