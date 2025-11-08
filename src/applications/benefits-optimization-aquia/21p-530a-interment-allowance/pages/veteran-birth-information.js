import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranBirthInformationPage = {
  uiSchema: {
    ...titleUI('Veteran’s birth information'),
    veteranInformation: {
      dateOfBirth: currentOrPastDateUI('Date of birth'),
      veteranBirthLocation: addressUI({
        omit: [
          'isMilitary',
          'country',
          'street',
          'street2',
          'street3',
          'postalCode',
        ],
        required: {
          state: () => true,
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        required: ['dateOfBirth', 'veteranBirthLocation'],
        properties: {
          dateOfBirth: currentOrPastDateSchema,
          veteranBirthLocation: addressSchema({
            omit: [
              'isMilitary',
              'country',
              'street',
              'street2',
              'street3',
              'postalCode',
            ],
          }),
        },
      },
    },
  },
};
