import {
  titleUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('National Guard Unit address'),
    unitAddress: addressUI({
      title: 'Reserve or National Guard Unit address',
      omit: ['isMilitary', 'street3'],
    }),
  },
  schema: {
    type: 'object',
    required: ['unitAddress'],
    properties: {
      unitAddress: addressSchema({
        omit: ['isMilitary', 'street3'],
      }),
    },
  },
};
