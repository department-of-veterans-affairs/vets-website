import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description':
      'We’ll send any updates about your request to this address',
    preparerAddress: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      preparerAddress: addressSchema(),
    },
  },
};
