import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your mailing address',
      'We’ll mail information about this application to the address you provide here.',
    ),
    address: addressUI({
      omit: ['street3', 'isMilitary'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({
        omit: ['street3', 'isMilitary'],
      }),
    },
  },
};
