import {
  addressSchema,
  addressUI,
  titleUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

export const uiSchema = {
  veteranContactInformation: {
    ...titleUI('Mailing address'),
    veteranAddress: {
      ...addressUI({
        title: '',
        labels: {
          militaryCheckbox:
            'I live on a United States military base outside of the U.S.',
        },
      }),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    veteranContactInformation: {
      type: 'object',
      properties: {
        veteranAddress: addressSchema(),
      },
    },
  },
};
