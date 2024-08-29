import React, { useEffect, useState } from 'react';
import { FACILITY_SORT_METHODS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import FacilityAddress from '../../../components/FacilityAddress';

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
        scrollAndFocus(`#${id}_${INITIAL_FACILITY_DISPLAY_COUNT + 1}`);
      }
    },
    [displayedOptions.length, displayAll],
  );

  return (
    <div>
      {displayedOptions.map((option, i) => {
        const { name, legacyVAR } = option?.label;
        const checked = option.value === value;
        let distance;

        if (sortMethod === FACILITY_SORT_METHODS.distanceFromResidential) {
          distance = legacyVAR?.distanceFromResidentialAddress;
        } else if (
          sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation
        ) {
          distance = legacyVAR?.distanceFromCurrentLocation;
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
              <span className="vads-u-display--block">
                <FacilityAddress facility={option?.label} showPhone={false} />
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
            className="additional-info-button usa-button-secondary vads-u-display--block"
            onClick={() => {
              setDisplayAll(!displayAll);
            }}
          >
            <span className="sr-only">show</span>
            <span>
              {`Show ${hiddenCount} more location${
                hiddenCount === 1 ? '' : 's'
              }`}
            </span>
          </button>
        )}
    </div>
  );
}
