import React from 'react';
import date from 'platform/forms-system/src/js/definitions/date';
import { validateCurrentOrPastDate } from 'platform/forms-system/src/js/validation';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your bankruptcy details</h3>
      </legend>
    </>
  ),
  additionalData: {
    bankruptcy: {
      dateDischarged: {
        ...date('Date a court granted you a bankruptcy discharge'),
        'ui:validations': [validateCurrentOrPastDate],
        'ui:required': () => true,
      },
      courtLocation: {
        'ui:title': 'Location of court (city, state)',
        'ui:options': {
          widgetClassNames: 'input-size-6',
        },
        'ui:required': () => true,
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
        'ui:required': () => true,
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
