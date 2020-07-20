import React from 'react';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';

const filingClaimContent = <strong>I’m filing a claim for:</strong>;

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
      atLeastOne: 'Please select at least one type',
      required: 'Please select at least one type',
    },
    'view:claimingNew': {
      'ui:title': 'A new condition',
    },
    'view:claimingIncrease': {
      'ui:title': 'One or more of my rated conditions that have gotten worse',
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

export const updateFormData = (_, newData) => {
  const newCondition = newData['view:claimType']?.['view:claimingNew'];
  // skip "Do you have any new conditions you want to add to your claim?"
  // question if new condition claim type is selected
  return { ...newData, 'view:newDisabilities': newCondition };
};
