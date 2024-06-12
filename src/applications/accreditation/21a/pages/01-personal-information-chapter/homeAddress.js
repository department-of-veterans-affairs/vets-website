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
    ...titleUI(
      'Home address',
      "We'll send any important information about your form to this address.",
    ),
    homeAddress: addressUI({
      labels: {
        state: 'State/Province/Region',
      },
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
