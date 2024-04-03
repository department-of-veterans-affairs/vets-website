import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { dateOfDeathUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import { generateTitle } from '../../../utils/helpers';

const { deathDate, burialDate } = fullSchemaBurials.properties;

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
      'ui:title': 'Date of burial (includes cremation or interment)',
      'ui:webComponentField': VaMemorableDateField,
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
      'ui:errorMessages': {
        pattern: 'Please enter a valid current or past date',
        required: 'Please enter a date',
      },
      'ui:reviewField': ReviewField,
    },
  },
  schema: {
    type: 'object',
    required: ['burialDate', 'deathDate'],
    properties: {
      deathDate,
      burialDate,
    },
  },
};
