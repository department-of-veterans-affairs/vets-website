import {
  addressSchema,
  addressUI,
  titleUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Home address',
  path: 'home-address',
  uiSchema: {
    ...titleUI('Primary home address'),
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
