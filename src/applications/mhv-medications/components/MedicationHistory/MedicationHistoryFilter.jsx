import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { selectFilterOption } from '../../selectors/selectPreferences';
import { setFilterOption } from '../../redux/preferencesSlice';

export const FILTER_OPTIONS = [
  {
    key: 'ACTIVE',
    label: 'Active medications',
    urlV1:
      'filter[[disp_status][eq]]=Active,Active: Refill in Process,Active: Non-VA,Active: On Hold,Active: Parked,Active: Submitted',
    urlV2: 'filter[[disp_status][eq]]=Active',
  },
  {
    key: 'RENEWAL',
    label: 'Renewal needed before refill',
    urlV1: 'filter[[is_renewable][eq]]=true',
    urlV2: 'filter[[is_renewable][eq]]=true',
  },
  {
    key: 'INACTIVE',
    label: 'Inactive medications',
    urlV1: 'filter[[disp_status][eq]]=Discontinued,Expired,Transferred,Unknown',
    urlV2: 'filter[[disp_status][eq]]=Inactive',
  },
  {
    key: 'ALL_MEDICATIONS',
    label: 'All medications',
    urlV1: '',
    urlV2: '',
  },
];

export const FILTER_OPTIONS_MAP = Object.fromEntries(
  FILTER_OPTIONS.map(opt => [opt.key, opt]),
);

/**
 * Returns the correct filter URL for the given key based on API version.
 * - Both cerner_pilot + v2_status_mapping → V2 URLs
 * - Only cerner_pilot → V1 URLs but RENEWAL uses V2 URL
 * - Otherwise → V1 URLs
 * @param {string} key - Filter option key
 * @param {boolean} isCernerPilot - Whether Cerner pilot flag is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping flag is enabled
 * @returns {string} The filter URL query parameter string
 */
export const getFilterUrl = (key, isCernerPilot, isV2StatusMapping) => {
  const option = FILTER_OPTIONS_MAP[key];
  if (!option) return '';
  if (isCernerPilot && isV2StatusMapping) return option.urlV2;
  if (isCernerPilot && key === 'RENEWAL') return option.urlV2;
  return option.urlV1;
};

const DEFAULT_FILTER = 'ALL_MEDICATIONS';

const MedicationHistoryFilter = ({ updateFilter, isLoading }) => {
  const dispatch = useDispatch();
  const filterOption = useSelector(selectFilterOption);
  const [selectedFilterOption, setSelectedFilterOption] = useState(
    filterOption || DEFAULT_FILTER,
  );

  // Sync local state when Redux filter changes (e.g., default override)
  useEffect(
    () => {
      if (filterOption) {
        setSelectedFilterOption(filterOption);
      }
    },
    [filterOption],
  );

  const handleFilterOptionChange = ({ detail }) => {
    setSelectedFilterOption(detail.value);
  };

  const handleFilterSubmit = () => {
    dispatch(setFilterOption(selectedFilterOption));
    updateFilter(selectedFilterOption);
    waitForRenderThenFocus('#showingRx', document, 500);
  };

  return (
    <div className="medication-history-filter vads-u-margin-top--3">
      <VaRadio
        label="Select medications to show in list"
        label-header-level={2}
        data-testid="medication-history-filter"
        onVaValueChange={handleFilterOptionChange}
        className="vads-u-margin-top--0"
        uswds
      >
        {FILTER_OPTIONS.map(({ key, label }) => (
          <span
            key={`filter-option-${key}`}
            className={
              selectedFilterOption === key ? 'filter-option--selected' : ''
            }
          >
            <VaRadioOption
              label={label}
              name="medication-history-filter-group"
              value={key}
              checked={selectedFilterOption === key}
              data-testid={`medication-history-filter-option-${key}`}
            />
          </span>
        ))}
      </VaRadio>
      <VaButton
        className="vads-u-margin-top--2"
        onClick={handleFilterSubmit}
        text="Update list"
        data-testid="update-list-button"
        loading={isLoading}
      />
    </div>
  );
};

MedicationHistoryFilter.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default MedicationHistoryFilter;
