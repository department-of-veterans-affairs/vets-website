import {
  addressSchema,
  addressUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // Need to update this to description later
    rjsf: titleUI('We’ll send any updates about your request to this address'),
    preparerAddress: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      preparerAddress: addressSchema(),
    },
  },
};
