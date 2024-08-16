import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Home address',
  path: 'home-address',
  uiSchema: {
    ...titleUI('Home address', 'Enter the address where you currently live.'),
    homeAddress: addressUI({
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      homeAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
