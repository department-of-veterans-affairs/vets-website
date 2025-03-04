import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your organization’s mailing address',
      'We’ll mail information about this application to the organization’s address you provide here.',
    ),
    address: addressNoMilitaryUI({
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressNoMilitarySchema({
        omit: ['street3'],
      }),
    },
  },
};
