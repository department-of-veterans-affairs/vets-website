import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Work address',
  path: 'work-address',
  uiSchema: {
    ...titleUI('Work address'),
    workAddress: addressUI({
      labels: {
        militaryCheckbox:
          'I work on a United States military base outside of the U.S.',
        state: 'State/Province/Region',
      },
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      workAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
