import React from 'react';
import { getCernerPortalLink } from '../utils/appointment';

/*
 * This is a copy of the form system RadioWidget, but with custom
 * code to disable certain options. This isn't currently supported by the
 * form system.
 */
export default function SystemsRadioWidget({
  options,
  value,
  onChange,
  id,
  formContext,
}) {
  const { enumOptions, labels = {} } = options;
  const cernerFacilities = formContext.cernerFacilities;

  return (
    <div>
      {enumOptions.map((option, i) => {
        const checked = option.value === value;
        const isCerner = cernerFacilities.some(facilityId =>
          option.value.startsWith(facilityId),
        );
        return (
          <div className="form-radio-buttons" key={option.value}>
            <input
              type="radio"
              checked={checked}
              id={`${id}_${i}`}
              name={`${id}`}
              value={option.value}
              disabled={isCerner}
              onChange={_ => onChange(option.value)}
            />
            <label htmlFor={`${id}_${i}`}>
              {labels[option.value] || option.label}
              {isCerner && (
                <>
                  <br />
                  <strong>
                    To schedule a VA appointment at this location, go to{' '}
                    <a
                      href={getCernerPortalLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      My VA Health
                    </a>
                  </strong>
                  .
                </>
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
}
