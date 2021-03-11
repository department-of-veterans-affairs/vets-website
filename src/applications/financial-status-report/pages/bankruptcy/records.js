import React from 'react';

export const uiSchema = {
  'ui:title': 'Your bankruptcy details',
  additionalData: {
    bankruptcy: {
      dateDischarged: {
        'ui:title': 'Date a court granted you a bankruptcy discharge',
        'ui:widget': 'date',
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
