import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantAddress: addressUI({ omit: ['isMilitary'] }),
  },
  schema: {
    type: 'object',
    properties: {
      claimantAddress: addressSchema({ omit: ['isMilitary'] }),
    },
  },
};
