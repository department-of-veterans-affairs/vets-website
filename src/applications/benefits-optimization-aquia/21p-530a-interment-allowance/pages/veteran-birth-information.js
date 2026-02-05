import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranBirthInformationPage = {
  uiSchema: {
    ...titleUI('Veteran’s birth information'),
    veteranInformation: {
      dateOfBirth: currentOrPastDateUI('Date of birth'),
      placeOfBirth: addressUI({
        omit: ['isMilitary', 'street', 'street2', 'postalCode', 'street3'],
        required: {
          country: () => false,
          city: () => false,
          state: () => false,
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        required: ['dateOfBirth'],
        properties: {
          dateOfBirth: currentOrPastDateSchema,
          placeOfBirth: addressSchema({
            omit: ['isMilitary', 'street', 'street2', 'postalCode', 'street3'],
          }),
        },
      },
    },
  },
};
