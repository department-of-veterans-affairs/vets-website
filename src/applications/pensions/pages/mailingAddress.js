import {
  addressSchema,
  addressUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Mailing address',
    veteranAddress: addressUI('Mailing address'),
  },
  schema: {
    type: 'object',
    required: ['veteranAddress'],
    properties: {
      veteranAddress: addressSchema({
        labels: {
          militaryCheckbox:
            'I receive mail outside of the United States on a U.S. military base',
        },
        omit: ['street3'],
      }),
    },
  },
};
