import React, { useEffect, useState } from 'react';
import { FACILITY_SORT_METHODS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';

const INITIAL_FACILITY_DISPLAY_COUNT = 5;

/*
 * This is a copy of the form system RadioWidget, but with custom
 * code to disable certain options. This isn't currently supported by the
 * form system.
 */
export default function FacilitiesRadioWidget({
  options,
  value,
  onChange,
  formContext,
}) {
  const { loadingEligibility, sortMethod } = formContext;
  const { enumOptions } = options;
  const selectedIndex = enumOptions.findIndex(o => o.value === value);

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
        scrollAndFocus(`#facility_${INITIAL_FACILITY_DISPLAY_COUNT}`);
      }
    },
    [displayedOptions.length, displayAll],
  );

  return (
    <div>
      {displayedOptions.map((facility, facilityIndex) => {
        const { id, name, address, legacyVAR } = facility?.label;
        const checked = facility.value === value;
        let distance;

        if (sortMethod === FACILITY_SORT_METHODS.distanceFromResidential) {
          distance = legacyVAR?.distanceFromResidentialAddress;
        } else if (
          sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation
        ) {
          distance = legacyVAR?.distanceFromCurrentLocation;
        }

        return (
          <div
            className="form-radio-buttons"
            key={facility.value}
            aria-atomic="true"
            aria-live="assertive"
          >
            <input
              type="radio"
              checked={checked}
              id={`facility_${facilityIndex}`}
              name={`${id}`}
              value={facility.value}
              onChange={_ => onChange(facility.value)}
              disabled={loadingEligibility}
            />
            <label htmlFor={`facility_${facilityIndex}`}>
              <span className="vads-u-display--block vads-u-font-weight--bold">
                {name}
              </span>
              <span className="vads-u-display--block vads-u-font-size--sm">
                {address?.city}, {address?.state}
              </span>
              {!!distance && (
                <span className="vads-u-display--block vads-u-font-size--sm">
                  {distance} miles
                </span>
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
            aria-atomic="true"
            aria-live="assertive"
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
