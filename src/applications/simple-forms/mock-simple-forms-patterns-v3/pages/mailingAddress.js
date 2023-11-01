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
    address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
  },
};
