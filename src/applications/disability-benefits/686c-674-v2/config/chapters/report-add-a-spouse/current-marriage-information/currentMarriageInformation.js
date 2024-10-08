import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    spouseAddress: addressSchema(),
  },
};

export const uiSchema = {
  ...titleUI('Spouse’s address'),
  spouseAddress: {
    ...addressUI({
      labels: {
        militaryCheckbox:
          'Spouse receives mail outside of the United States on a U.S. military base.',
      },
    }),
  },
};
