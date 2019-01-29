import React from 'react';
import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';

const filingClaimContent = <strong>I’m filing a claim:</strong>;

export const uiSchema = {
  'ui:description':
    'Please tell us what type of disability claim you’re filing. (Select all that apply.)',
  'view:claimType': {
    'ui:title': filingClaimContent,
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:validations': [validateBooleanGroup],
    'ui:errorMessages': {
      atLeastOne: 'Please select at least one',
      required: 'Please select at least one',
    },
    'view:claimingNew': {
      'ui:title': 'For a new condition',
    },
    'view:claimingIncrease': {
      'ui:title': 'Because one or more of my rated conditions has gotten worse',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:claimType': {
      type: 'object',
      properties: {
        'view:claimingNew': { type: 'boolean' },
        'view:claimingIncrease': { type: 'boolean' },
      },
    },
  },
};
