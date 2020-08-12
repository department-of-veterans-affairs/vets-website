import React from 'react';
import classNames from 'classnames';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { Link } from 'react-router';

export default function ExpressCareReasonField({
  uiSchema,
  formData,
  onChange,
  errorSchema,
  formContext,
  onError,
}) {
  const { reason, additionalInformation } = formData;
  const hasError =
    formContext.submitted && errorSchema.reason.__errors.length > 0;

  const radioGroupClasses = classNames({
    'usa-input-error': hasError,
  });

  return (
    <>
      <h2>Tell us about your health concern</h2>
      <fieldset>
        <legend
          id="vaos-express-care__radiogroup-label"
          className="vads-u-font-size--base vads-u-color--gray-dark vads-u-font-weight--normal"
        >
          Please select a concern from the list the best fits your needs today.
          <span className="schemaform-required-span">(*Required)</span>
        </legend>
        <div
          className={radioGroupClasses}
          role="radiogroup"
          aria-labelledby="vaos-express-care__radiogroup-label"
        >
          {hasError && (
            <span className="usa-input-error-message" role="alert">
              <span className="sr-only">Error</span> Please select a symptom
            </span>
          )}
          {uiSchema.options.items.map((option, index) => {
            const checked = option.value === reason;
            const divClasses = classNames('vads-u-padding-left--1', {
              'vads-u-padding-bottom--1': checked,
              'vads-u-border-color--primary-alt-light': checked,
              'vads-u-border-color--white': !checked,
              'vads-u-border-left--7px': !hasError,
              'vads-u-margin-left--neg2': !hasError,
            });

            return (
              <div key={`reason-radio-${index}`} className={divClasses}>
                <input
                  type="radio"
                  id={`root_reasonForRequest_reason_${option.id}`}
                  name="root_reasonForRequest_reason"
                  checked={checked}
                  aria-checked={checked}
                  value={option.value}
                  onChange={_ =>
                    onChange({ ...formData, reason: option.value })
                  }
                />
                <label
                  name={`root_reasonForRequest_reason_label_${option.id}`}
                  htmlFor={`root_reasonForRequest_reason_${option.id}`}
                  className="vaos-express-care__reason-radio-label vads-u-margin-top--2p5 vads-u-display--flex"
                >
                  <div className="vads-u-margin-top--0p5">
                    <span className="vads-u-display--block vads-u-font-weight--bold">
                      {option.label}
                    </span>
                    {!!option.secondaryLabel && (
                      <>
                        <span className="vads-u-display--block">
                          {option.secondaryLabel}
                        </span>
                      </>
                    )}
                  </div>
                </label>

                {checked && (
                  <div className="vaos-express-care__reason-textarea-container">
                    <label
                      htmlFor={`vaos-express-care__textarea-${option.id}`}
                      className="vads-u-margin-top--2"
                    >
                      Please provide additional details about your symptoms
                      (optional)
                    </label>
                    <textarea
                      id={`vaos-express-care__textarea-${option.id}`}
                      className="vads-u-margin-top--0p5"
                      value={additionalInformation}
                      onChange={e =>
                        onChange({
                          ...formData,
                          additionalInformation: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>
      <AlertBox
        status="info"
        className="vads-u-margin-top--2 vads-u-padding--2"
      >
        Don't see your symptoms listed?{' '}
        <Link id="new-appointment" to="/new-appointment">
          Schedule an appointment here
        </Link>
        .
      </AlertBox>
    </>
  );
}
