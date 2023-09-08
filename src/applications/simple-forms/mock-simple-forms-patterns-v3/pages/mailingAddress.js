import {
  addressSchema,
  addressUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleUI(
      'Mailing address',
      "We'll send any important information about your application to this address.",
    ),
    address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      address: addressSchema(),
    },
  },
};
