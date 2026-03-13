import get from 'platform/utilities/data/get';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  FDCDescription,
  FDCWarning,
  noFDCWarning,
} from '../content/fullyDevelopedClaim';
import ConfirmationFullyDevelopedClaim from '../components/confirmationFields/ConfirmationFullyDevelopedClaim';

export const uiSchema = {
  'ui:description': FDCDescription,
  standardClaim: yesNoUI({
    title: 'Do you want to apply using the Fully Developed Claim program?',
    yesNoReverse: true,
    labels: {
      Y: 'Yes, I have uploaded all my supporting documents.',
      N: 'No, I have some extra information that I’ll submit to VA later.',
    },
    errorMessages: {
      required: 'You must provide a response',
    },
  }),
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
    standardClaim: yesNoSchema,
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
