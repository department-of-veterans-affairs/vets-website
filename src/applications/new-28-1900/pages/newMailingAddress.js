import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'New mailing address',
      "You told us you're moving in the next 30 days. Enter your new mailing address.",
    ),
    newMailingAddress: addressUI({
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      newMailingAddress: addressSchema(),
    },
  },
};
