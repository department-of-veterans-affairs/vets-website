import React from 'react';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  dateOfDeathUI,
  dateOfDeathSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import { generateTitle } from '../../../utils/helpers';

export const ReviewField = ({ children }) => (
  <div className="review-row">
    <dt>Date of burial</dt>
    <dd>
      {children.props.formData && (
        <>
          {new Date(`${children.props.formData}T00:00:00`).toLocaleDateString(
            'en-us',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )}
        </>
      )}
    </dd>
  </div>
);

export default {
  uiSchema: {
    'ui:title': generateTitle('Burial information'),
    deathDate: dateOfDeathUI('Date of death'),
    burialDate: {
      ...currentOrPastDateUI({
        title: 'Date of burial (includes cremation or interment)',
      }),
      'ui:validations': [
        (errors, value, formData) => {
          if (formData.burialDate && formData.deathDate) {
            const death = new Date(formData.deathDate);
            const burial = new Date(formData.burialDate);

            if (burial < death) {
              errors.addError(
                'Burial date must be on or after the Veterans date of death',
              );
            }

            if (differenceInCalendarMonths(burial, death) > 12) {
              errors.addError('Burial date must be within 12 months of death');
            }
          }
          return errors;
        },
      ],
      'ui:reviewField': ReviewField,
    },
  },
  schema: {
    type: 'object',
    required: ['burialDate', 'deathDate'],
    properties: {
      deathDate: dateOfDeathSchema,
      burialDate: currentOrPastDateSchema,
    },
  },
};
