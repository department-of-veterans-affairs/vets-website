import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getCernerURL } from 'platform/utilities/cerner';
import Select from '@department-of-veterans-affairs/component-library/Select';
import { selectFacilitiesRadioWidget } from '../../redux/selectors';
import State from '../../../components/State';
import { FACILITY_SORT_METHODS, GA_PREFIX } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { isCernerLocation } from '../../../services/location';
import recordEvent from 'platform/monitoring/record-event';

const INITIAL_FACILITY_DISPLAY_COUNT = 5;

/*
 * This is a copy of the form system RadioWidget, but with custom
 * code to disable certain options. This isn't currently supported by the
 * form system.
 */
export default function FacilitiesRadioWidget({
  id,
  options,
  value,
  onChange,
  formContext,
}) {
  const {
    cernerSiteIds,
    showVariant,
    sortMethod,
    loadingEligibility,
  } = useSelector(state => selectFacilitiesRadioWidget(state), shallowEqual);
  const { setSortType, sortOptions, sortType } = formContext;
  const { enumOptions } = options;
  const selectedIndex = enumOptions.findIndex(o => o.value === value);
  const sortedByText = sortMethod
    ? sortOptions.find(type => type.value === sortMethod).label
    : sortOptions[0].label;

  // If user has already selected a value, and the index of that value is > 4,
  // show this view already expanded
  const [displayAll, setDisplayAll] = useState(
    selectedIndex >= INITIAL_FACILITY_DISPLAY_COUNT,
  );

  // currently shown facility list
  const displayedOptions = displayAll
    ? enumOptions
    : enumOptions.slice(0, INITIAL_FACILITY_DISPLAY_COUNT);
  // remaining facilities count
  const hiddenCount =
    enumOptions.length > INITIAL_FACILITY_DISPLAY_COUNT
      ? enumOptions.length - INITIAL_FACILITY_DISPLAY_COUNT
      : 0;
  useEffect(
    () => {
      if (displayedOptions.length > INITIAL_FACILITY_DISPLAY_COUNT) {
        scrollAndFocus(`#${id}_${INITIAL_FACILITY_DISPLAY_COUNT + 1}`);
      }
    },
    [displayedOptions.length, displayAll],
  );

  return (
    <div>
      <div aria-live="assertive" className="sr-only">
        Showing VA facilities sorted {sortedByText}
      </div>
      {showVariant && (
        <Select
          label="Sort facilities"
          name="sort"
          onValueChange={type => {
            recordEvent({
              event: `${GA_PREFIX}_variant_method_${sortMethod}`,
            });
            setSortType(type.value);
          }}
          options={sortOptions}
          value={{ dirty: false, value: sortType }}
          includeBlankOption={false}
        />
      )}
      {displayedOptions.map((option, i) => {
        const { name, address, legacyVAR } = option?.label;
        const checked = option.value === value;
        const isCerner = isCernerLocation(option.value, cernerSiteIds);
        let distance;

        if (sortMethod === FACILITY_SORT_METHODS.distanceFromResidential) {
          distance = legacyVAR?.distanceFromResidentialAddress;
        } else if (
          sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation
        ) {
          distance = legacyVAR?.distanceFromCurrentLocation;
        } else {
          distance = legacyVAR?.distanceFromResidentialAddress;
        }
        const facilityPosition = i + 1;

        return (
          <div className="form-radio-buttons" key={option.value}>
            <input
              type="radio"
              checked={checked}
              id={`${id}_${facilityPosition}`}
              name={`${id}`}
              value={option.value}
              onChange={_ => onChange(option.value)}
              disabled={loadingEligibility}
            />
            <label htmlFor={`${id}_${facilityPosition}`}>
              <span className="vads-u-display--block vads-u-font-weight--bold">
                {name}
              </span>
              <span className="vads-u-display--block vads-u-font-size--sm">
                {address?.city}, <State state={address?.state} />
              </span>
              {!!distance && (
                <span className="vads-u-display--block vads-u-font-size--sm">
                  {distance} miles
                </span>
              )}
              {isCerner && (
                <a href={getCernerURL('/pages/scheduling/upcoming')}>
                  Schedule online at <strong>My VA Health</strong>
                </a>
              )}
            </label>
          </div>
        );
      })}
      {!displayAll &&
        hiddenCount > 0 && (
          <button
            type="button"
            className="additional-info-button va-button-link vads-u-display--block"
            onClick={() => {
              setDisplayAll(!displayAll);
            }}
          >
            <span className="sr-only">show</span>
            <span className="va-button-link">
              {`+ ${hiddenCount} more location${hiddenCount === 1 ? '' : 's'}`}
            </span>
          </button>
        )}
    </div>
  );
}
