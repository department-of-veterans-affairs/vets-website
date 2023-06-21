import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import {
  claimantIdentificationKeys,
  claimantIdentificationOptions,
} from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantIdentification: {
      'ui:title': 'Who will you be acting as an alternate signer for?',
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: claimantIdentificationOptions,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      claimantIdentification: {
        type: 'string',
        enum: claimantIdentificationKeys,
      },
    },
    required: ['claimantIdentification'],
  },
};
