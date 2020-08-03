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

  const fieldsetClasses = classNames({
    'usa-input-error': hasError,
  });

  return (
    <>
      <fieldset className={fieldsetClasses}>
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
              <div>
                <input
                  type="radio"
                  id={`vaos-express-care__radio-${option.id}`}
                  checked={checked}
                  value={option.value}
                  onChange={_ =>
                    onChange({ ...formData, reason: option.value })
                  }
                />
                <label
                  name={`vaos-express-care__radio-label-${option.id}`}
                  htmlFor={`vaos-express-care__radio-${option.id}`}
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
              </div>

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
