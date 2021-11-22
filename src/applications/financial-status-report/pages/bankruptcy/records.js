import React from 'react';
import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
import { validateCurrentOrPastDate } from 'platform/forms-system/src/js/validation';

export const uiSchema = {
  'ui:title': 'Your bankruptcy details',
  additionalData: {
    bankruptcy: {
      dateDischarged: {
        ...monthYearUI('Date a court granted you a bankruptcy discharge'),
        'ui:validations': [validateCurrentOrPastDate],
      },
      courtLocation: {
        'ui:title': 'Location of court (city, state)',
        'ui:options': {
          widgetClassNames: 'input-size-6',
        },
      },
      docketNumber: {
        'ui:title': 'Case or docket number',
        'ui:description': (
          <p className="formfield-subtitle">
            You’ll find this number on your case documents.
          </p>
        ),
        'ui:options': {
          widgetClassNames: 'input-size-6',
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalData: {
      type: 'object',
      properties: {
        bankruptcy: {
          type: 'object',
          properties: {
            dateDischarged: {
              type: 'string',
            },
            courtLocation: {
              type: 'string',
            },
            docketNumber: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
