import get from 'platform/utilities/data/get';
import {
  FDCDescription,
  FDCWarning,
  noFDCWarning,
} from '../content/fullyDevelopedClaim';
import ConfirmationFullyDevelopedClaim from '../components/confirmationFields/ConfirmationFullyDevelopedClaim';

export const uiSchema = {
  'ui:description': FDCDescription,
  standardClaim: {
    'ui:title': 'Do you want to apply using the Fully Developed Claim program?',
    'ui:widget': 'yesNo',
    'ui:options': {
      yesNoReverse: true,
      labels: {
        Y: 'Yes, I have uploaded all my supporting documents.',
        N: 'No, I have some extra information that I’ll submit to VA later.',
      },
    },
  },
  'view:fdcWarning': {
    'ui:description': FDCWarning,
    'ui:options': {
      hideIf: formData => get('standardClaim', formData),
    },
  },
  'view:noFdcWarning': {
    'ui:description': noFDCWarning,
    'ui:options': {
      hideIf: formData => !get('standardClaim', formData),
    },
  },
  'ui:confirmationField': ConfirmationFullyDevelopedClaim,
};

export const schema = {
  type: 'object',
  required: ['standardClaim'],
  properties: {
    standardClaim: {
      type: 'boolean',
    },
    'view:fdcWarning': {
      type: 'object',
      properties: {},
    },
    'view:noFdcWarning': {
      type: 'object',
      properties: {},
    },
  },
};
