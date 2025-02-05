import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { THIRD_PARTY_TYPES } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    thirdPartyType: radioUI({
      title:
        'Do you authorize us to release your information to a specific person or to an organization?',
      labels: {
        [THIRD_PARTY_TYPES.PERSON]: 'A specific person',
        [THIRD_PARTY_TYPES.ORGANIZATION]: 'An organization',
      },
      errorMessages: {
        required:
          'Please select who you would like us to release information to',
      },
      labelHeaderLevel: '3',
    }),
  },
  schema: {
    type: 'object',
    required: ['thirdPartyType'],
    properties: {
      thirdPartyType: radioSchema(Object.values(THIRD_PARTY_TYPES)),
    },
  },
};
