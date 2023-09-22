import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import {
  claimantIdentificationKeys,
  claimantIdentificationOptions,
} from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantIdentification: {
      'ui:title': 'Who will you be signing for?',
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: claimantIdentificationOptions,
      },
      'ui:errorMessages': {
        required: 'Please select who you will be signing for',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      claimantIdentification: {
        type: 'string',
        // maybe use Object.keys, Object.values instead?
        enum: claimantIdentificationKeys,
      },
    },
    required: ['claimantIdentification'],
  },
};
