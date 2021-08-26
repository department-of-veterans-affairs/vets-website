import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Select from '@department-of-veterans-affairs/component-library/Select';
import { FACILITY_SORT_METHODS } from '../../../utils/constants';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import { updateCCProviderSortMethod } from '../../redux/actions';

export default function ProviderSortVariant() {
  const dispatch = useDispatch();
  const { ccEnabledSystems, sortMethod } = useSelector(
    selectProviderSelectionInfo,
    shallowEqual,
  );
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
  return (
    <div className="vads-u-margin-bottom--3">
      <Select
        label="Show providers closest to"
        name="sort"
        onValueChange={handleValueChange}
        options={sortOptions}
        value={{ dirty: false, value: selectedSortMethod }}
        includeBlankOption={false}
      />
    </div>
  );
}
