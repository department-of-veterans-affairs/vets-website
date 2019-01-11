import React from 'react';
import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const pastEmploymentHistory = (
  <div>
    <p>
      For the second step of your Individual Unemployability claim, we need to
      verify your past employment.
    </p>
    <p>
      To help speed up this process, you can send a Request for Employment
      Information (VA Form 21-4192) to each of your employers from the last 12
      months you worked. You‘ll need to fill out some of the form with your
      details before sending it to your employer.
    </p>
    <p>
      VA will send the form on your behalf, but you may be able to get it
      completed more quickly.
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': pastEmploymentHistory,
  'view:upload4192Choice': {
    'ui:title': 'Please tell us what you‘d like to do.',
    'ui:options': { showFieldLabel: true },
    'ui:validations': [
      {
        validator: validateBooleanGroup,
      },
    ],
    'ui:errorMessages': {
      atLeastOne: ' Please select at least one option (or all that apply).',
    },
    'view:4192Info': {
      'ui:title': 'I want to find out how to complete VA Form 21-4192.',
    },
    'view:download4192': {
      'ui:title':
        'I want to download a Request for Employment Information (VA Form 21-4192).',
    },
    'view:upload4192': {
      'ui:title':
        ' want to upload a completed Request for Employment Information (VA Form 21-4192).',
    },
    'view:sendRequests': {
      'ui:title': 'I would like you to handle these requests for me.',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:upload4192Choice': {
      type: 'object',
      properties: {
        'view:4192Info': {
          type: 'boolean',
        },
        'view:download4192': {
          type: 'boolean',
        },
        'view:upload4192': {
          type: 'boolean',
        },
        'view:sendRequests': {
          type: 'boolean',
        },
      },
    },
  },
};
