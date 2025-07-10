import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Banana stand address',
      "It's where we've hidden the money, in the banana stand",
    ),
    bananastandAddress: addressUI({
      labels: {
        street2: 'Street address line 2',
      },
      omit: ['street3'],
      required: {
        street2: false,
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      bananastandAddress: addressSchema({
        omit: ['street3'],
      }),
    },
    required: ['bananastandAddress'],
  },
};
