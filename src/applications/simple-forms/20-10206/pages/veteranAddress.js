import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Mailing address',
      "We'll send any important information about your application to this address.",
    ),
    veteranAddress: addressUI({
      required: {
        street2: false,
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranAddress: addressSchema(),
    },
    required: ['veteranAddress'],
  },
};
