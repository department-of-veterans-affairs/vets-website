import React from 'react';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';

const options = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

export default {
  uiSchema: {
    requestEmblemOfBelief: {
      ...radioUI({
        title:
          'Would you like to request an emblem of belief be added to the headstone or marker?',
        options,
        required: true,
        errorMessages: { required: 'Select yes or no' },
      }),
      'ui:required': () => true,
    },
    'view:emblemLink': {
      'ui:description': (
        <p className="vads-u-margin-top--2">
          <a
            href="https://www.cem.va.gov/hmm/emblems.asp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about emblems of belief (Opens in a new tab)
          </a>
        </p>
      ),
    },
    'ui:order': ['requestEmblemOfBelief', 'view:emblemLink'],
  },
  schema: {
    type: 'object',
    required: ['requestEmblemOfBelief'],
    properties: {
      requestEmblemOfBelief: {
        type: 'string',
        enum: options.map(o => o.value),
        enumNames: options.map(o => o.label),
      },
      'view:emblemLink': {
        type: 'object',
        properties: {},
      },
    },
  },
};
