import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

import { pastEmploymentHistory } from '../content/pastEmploymentFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': pastEmploymentHistory,
  'view:upload4192Choice': {
    'ui:webComponentField': VaCheckboxGroupField,
    'ui:title': 'Please tell us what you’d like to do.',
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
        'I want to upload a completed Request for Employment Information (VA Form 21-4192).',
    },
    'view:sendRequests': {
      'ui:title': 'I would like you to handle these requests for me.',
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:upload4192Choice'],
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
