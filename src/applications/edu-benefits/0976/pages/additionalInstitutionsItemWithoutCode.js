import {
  titleUI,
  textUI,
  textSchema,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Additional location name and mailing address'),
    name: {
      ...textUI({
        title: 'Additional location name',
        errorMessages: {
          required: 'Enter the name of the additional location',
        },
      }),
    },
    mailingAddress: {
      ...addressNoMilitaryUI(),
    },
  },

  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      mailingAddress: addressNoMilitarySchema(),
    },
    required: ['name', 'mailingAddress'],
  },
};
