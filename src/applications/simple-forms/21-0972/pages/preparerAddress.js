import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerAddress: addressUI({ omit: ['isMilitary'] }),
  },
  schema: {
    type: 'object',
    properties: {
      preparerAddress: addressSchema({ omit: ['isMilitary'] }),
    },
  },
};
