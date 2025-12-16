import React from 'react';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateDate } from 'platform/forms-system/src/js/validation';

/**
 * Memorable date UI that allows any date (past, present, or future)
 * Uses VaMemorableDateField for UI consistency with currentOrPastDateUI
 * Validates date format only, no temporal restrictions
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
    'ui:validations': [validateDate],
    'ui:errorMessages': {
      'ui:errorMessages': {
        pattern:
          errorMessages?.pattern || 'Please enter a valid current or past date',
        required: errorMessages?.required || 'Please enter a date',
      },
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
