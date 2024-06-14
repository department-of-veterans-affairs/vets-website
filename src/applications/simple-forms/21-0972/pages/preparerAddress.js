import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description':
      'We’ll send any updates about your alternate signer certification to this address.',
    preparerAddress: addressUI({ omit: ['isMilitary'] }),
  },
  schema: {
    type: 'object',
    properties: {
      preparerAddress: addressSchema({ omit: ['isMilitary'] }),
    },
  },
};
