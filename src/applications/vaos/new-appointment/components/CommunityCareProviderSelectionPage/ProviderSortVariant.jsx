import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Select from '@department-of-veterans-affairs/component-library/Select';
import { FACILITY_SORT_METHODS, FETCH_STATUS } from '../../../utils/constants';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import {
  requestProvidersList,
  updateCCProviderSortMethod,
} from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';

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
    selectedCCFacility,
    sortMethod,
  } = useSelector(selectProviderSelectionInfo, shallowEqual);
  const [selectedSortMethod, setSelectedSortMethod] = useState(sortMethod);
  const sortOptions = [
    {
      value: FACILITY_SORT_METHODS.distanceFromResidential,
      label: 'Your home address',
    },
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
        dispatch(requestProvidersList(selectedCCFacility.position));
      }

      if (communityCareProviderList) {
        scrollAndFocus('#providerSelectionHeader');
      }
    },
    [selectedCCFacility, sortMethod],
  );

  const handleValueChange = option => {
    if (Object.values(FACILITY_SORT_METHODS).includes(option.value)) {
      setSelectedSortMethod(option.value);
      dispatch(updateCCProviderSortMethod(option.value));
    } else {
      const selectedFacility = ccEnabledSystems.find(
        facility => facility.id === option.value,
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
  return (
    <div className="vads-u-margin-bottom--3">
      {notLoading && (
        <p
          className="vads-u-margin--0"
          id="provider-list-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Displaying 1 to {currentlyShownProvidersList.length} of{' '}
          {communityCareProviderList.length} providers
        </p>
      )}
      <Select
        label="Show providers closest to"
        name="sort"
        onValueChange={handleValueChange}
        options={hasUserAddress ? sortOptions : sortOptions.slice(1)}
        value={{ dirty: false, value: selectedSortMethod }}
        includeBlankOption={false}
      />
      {!hasUserAddress && (
        <p>
          Note: To show providers near your home, you need to add your home
          address to{' '}
          <NewTabAnchor href="/profile">your VA profile</NewTabAnchor>.
        </p>
      )}
      {requestLocationStatusFailed && (
        <div
          id="providerSelectionBlockedLocation"
          className="vads-u-margin-top--3"
        >
          <InfoAlert
            status="warning"
            headline="Your browser is blocked from finding your current location."
            className="vads-u-background-color--gold-lightest vads-u-font-size--base"
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
