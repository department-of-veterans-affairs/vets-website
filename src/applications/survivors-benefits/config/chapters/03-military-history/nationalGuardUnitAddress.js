import {
  titleUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'National Guard unit address',
  path: 'veteran/national-guard-unit-address',
  uiSchema: {
    ...titleUI('National Guard unit address'),
    unitAddress: addressUI({
      title: 'Reserve or National Guard Unit address',
      omit: ['isMilitary'],
    }),
  },
  schema: {
    type: 'object',
    required: ['unitAddress'],
    properties: {
      unitAddress: addressSchema({
        omit: ['isMilitary'],
      }),
    },
  },
};
