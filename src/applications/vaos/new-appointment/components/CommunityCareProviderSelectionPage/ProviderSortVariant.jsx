import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Select from '@department-of-veterans-affairs/component-library/Select';
import { FETCH_STATUS, FACILITY_SORT_METHODS } from '../../../utils/constants';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import {
  requestProvidersList,
  updateCCProviderSortMethod,
} from '../../redux/actions';

export default function ProviderSortVariant() {
  const dispatch = useDispatch();
  const {
    address,
    ccEnabledSystems,
    communityCareProviderList,
    currentLocation,
    showCCIterations,
    sortMethod,
  } = useSelector(selectProviderSelectionInfo, shallowEqual);
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
  const handleValueChange = option => {
    if (Object.values(FACILITY_SORT_METHODS).includes(option.value)) {
      dispatch(updateCCProviderSortMethod(option.value));
    } else {
      const facilityPosition = ccEnabledSystems.find(
        facility => facility.id === option.value,
      ).position;
      dispatch(
        updateCCProviderSortMethod(
          FACILITY_SORT_METHODS.distanceFromFacility,
          facilityPosition,
        ),
      );
    }
  };
  return (
    <Select
      label="Show providers closest to"
      name="sort"
      onValueChange={handleValueChange}
      options={sortOptions}
      value={{ dirty: false, value: sortMethod }}
      includeBlankOption={false}
    />
  );
}
