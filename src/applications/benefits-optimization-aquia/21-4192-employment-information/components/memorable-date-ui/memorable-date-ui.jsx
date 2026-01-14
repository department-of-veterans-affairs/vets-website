import React from 'react';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateDate } from 'platform/forms-system/src/js/validation';
import { parseISODate } from 'platform/forms-system/src/js/helpers';

/**
 * Validates that all date parts (day, month, year) are provided and form a valid date.
 * Unlike validateDate, this enforces that all parts are present.
 * Unlike validateCurrentOrPastMemorableDate, this allows any valid date (past, present, or future).
 *
 * @param {Object} errors - Errors object to add validation errors to
 * @param {string} dateString - ISO date string to validate
 * @param {Object} formData - Current form data
 * @param {Object} schema - Current JSON Schema for the field
 * @param {Object} errorMessages - Custom error messages
 */
const validateMemorableDate = (
  errors,
  dateString,
  formData,
  schema,
  errorMessages = {},
) => {
  const { pattern = 'Please provide a valid date' } = errorMessages;

  validateDate(errors, dateString, formData, schema, errorMessages);

  const { day, month, year } = parseISODate(dateString);
  if (!day || !month || !year) {
    errors.addError(pattern);
  }
};

/**
 * Memorable date UI that allows any date (past, present, or future)
 * Uses VaMemorableDateField for UI consistency with currentOrPastDateUI
 * Validates date format AND enforces all date parts are present
 *
 * @param {object} options - Configuration options
 * @returns {object} UI schema
 */
export const MemorableDateUI = options => {
  const {
    title,
    errorMessages,
    required,
    dataDogHidden = false,
    ...uiOptions
  } = typeof options === 'object' ? options : { title: options };

  const uiTitle = title ?? 'Date';

  return {
    'ui:title': uiTitle,
    'ui:webComponentField': VaMemorableDateField,
    'ui:required': required,
    'ui:validations': [validateMemorableDate],
    'ui:errorMessages': {
      pattern: errorMessages?.pattern || 'Please enter a valid date',
      required: errorMessages?.required || 'Please enter a date',
    },
    'ui:options': {
      ...uiOptions,
    },
    'ui:reviewField': ({ children }) => (
      <div className="review-row">
        <dt>{uiTitle}</dt>
        <dd
          className={dataDogHidden ? 'dd-privacy-hidden' : undefined}
          data-dd-action-name={dataDogHidden ? uiTitle : undefined}
        >
          {children.props.formData && (
            <>
              {new Date(
                `${children.props.formData}T00:00:00`,
              ).toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </>
          )}
        </dd>
      </div>
    ),
  };
};
