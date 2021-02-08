import React from 'react';

const adjudicationOptions = [
  'Yes, I have been adjudicated as bankrupt.',
  'No, I haven’t been adjudicated as bankrupt.',
];

export const uiSchema = {
  'ui:title': 'Your bankruptcy history',
  bankruptcyHistory: {
    adjudicated: {
      'ui:title': 'Have you ever been adjudicated as bankrupt?',
      'ui:required': () => true,
      'ui:widget': 'radio',
    },
    hasBeenAdjudicated: {
      'ui:options': {
        expandUnder: 'adjudicated',
        expandUnderCondition: adjudicationOptions[0],
      },
      bankruptcyDischargeDate: {
        'ui:title': 'Date a court granted you a bankruptcy discharge',
        'ui:widget': 'date',
      },
      courtLocation: {
        'ui:title': 'Location of court (city, state)',
        'ui:options': {
          classNames: 'court-location',
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
    bankruptcyHistory: {
      type: 'object',
      properties: {
        adjudicated: {
          type: 'string',
          enum: adjudicationOptions,
        },
        hasBeenAdjudicated: {
          type: 'object',
          properties: {
            bankruptcyDischargeDate: {
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
