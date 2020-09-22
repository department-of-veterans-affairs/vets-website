import React, { useState } from 'react';

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
  id,
  formContext,
}) {
  const { enumOptions } = options;
  const selectedIndex = enumOptions.findIndex(o => o.value === value);

  // If user has already selected a value, and the index of that value is > 4,
  // show this view already expanded
  const [displayAll, setDisplayAll] = useState(
    selectedIndex >= INITIAL_FACILITY_DISPLAY_COUNT,
  );

  const { facilities } = formContext;
  const displayedOptions = displayAll
    ? enumOptions
    : enumOptions.slice(0, INITIAL_FACILITY_DISPLAY_COUNT);

  const hiddenCount = enumOptions.length - INITIAL_FACILITY_DISPLAY_COUNT;

  return (
    <div>
      {displayedOptions.map((option, i) => {
        const facility = facilities.find(f => f.id === option.value);
        const checked = option.value === value;

        return (
          <div className="form-radio-buttons" key={option.value}>
            <input
              type="radio"
              checked={checked}
              id={`${id}_${i}`}
              name={`${id}`}
              value={option.value}
              onChange={_ => onChange(option.value)}
            />
            <label htmlFor={`${id}_${i}`}>
              <span className="vads-u-display--block vads-u-font-weight--bold">
                {facility.name}
              </span>
              <span className="vads-u-display--block vads-u-font-size--sm">
                {facility.address?.city}, {facility.address?.state}
              </span>
            </label>
          </div>
        );
      })}

      {!displayAll && (
        <button
          type="button"
          className="additional-info-button va-button-link vads-u-display--block"
          onClick={() => setDisplayAll(!displayAll)}
        >
          <span className="additional-info-title">
            {`+ ${enumOptions.length -
              INITIAL_FACILITY_DISPLAY_COUNT} more location${
              hiddenCount === 1 ? '' : 's'
            }`}
            <i className="fas fa-angle-down" />
          </span>
        </button>
      )}
    </div>
  );
}
