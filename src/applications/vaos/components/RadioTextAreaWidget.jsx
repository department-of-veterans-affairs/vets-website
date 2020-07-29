import React from 'react';
import classNames from 'classnames';

export default function RadioTextAreaWidget({ uiSchema, formData, onChange }) {
  const { reason, additionalDetails } = formData;
  return (
    <fieldset className="fieldset-input vads-u-margin-bottom--1">
      {uiSchema.options.items.map((option, index) => {
        const checked = option.value === reason;
        const hasSecondaryLabel = !!option.secondaryLabel;
        const divClasses = classNames(
          'vads-u-border-left--7px',
          'vads-u-margin-left--neg2',
          'vads-u-padding-left--1',
          {
            'vads-u-padding-bottom--1': checked,
            'vads-u-border-color--primary-alt-light': checked,
            'vads-u-border-color--white': !checked,
          },
        );

        return (
          <div key={`reason-radio-${index}`} className={divClasses}>
            <div>
              <input
                type="radio"
                id={option.id}
                checked={checked}
                value={option.value}
                onChange={_ => onChange({ ...formData, reason: option.value })}
              />
              <label
                name="defaultName-0-label"
                htmlFor="defaultId-0"
                className="vads-u-display--flex"
              >
                <div className="vads-u-margin-top--neg0p5">
                  <span className="vads-u-display--block vads-u-font-weight--bold">
                    {option.label}
                  </span>
                  {hasSecondaryLabel && (
                    <>
                      <span className="vads-u-display--block">
                        {option.secondaryLabel}
                      </span>
                    </>
                  )}
                </div>
              </label>
            </div>

            {checked && (
              <div className="vaos-form__inline-radio-textarea">
                <label
                  htmlFor={`textarea-${option.id}`}
                  className="vads-u-margin-top--2"
                >
                  Please provide additional details about your symptoms
                  (optional)
                </label>
                <textarea
                  id={`textarea-${option.id}`}
                  className="vads-u-margin-top--0p5"
                  value={additionalDetails}
                  onChange={e =>
                    onChange({
                      ...formData,
                      additionalDetails: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </fieldset>
  );
}
