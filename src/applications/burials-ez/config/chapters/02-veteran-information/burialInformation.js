import React from 'react';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  dateOfDeathUI,
  dateOfDeathSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import { DateReviewField } from '../../../utils/helpers';

export default {
  uiSchema: {
    ...titleUI('Burial information'),
    deathDate: {
      ...dateOfDeathUI('Date of death'),
      'ui:reviewField': props => (
        <DateReviewField {...props} title="Date of death" />
      ),
    },
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
      'ui:reviewField': props => (
        <DateReviewField {...props} title="Date of burial" />
      ),
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
