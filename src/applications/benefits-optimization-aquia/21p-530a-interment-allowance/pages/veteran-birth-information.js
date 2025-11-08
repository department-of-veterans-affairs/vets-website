import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranBirthInformationPage = {
  uiSchema: {
    veteranBirthDate: currentOrPastDateUI('Date of birth'),
    veteranBirthLocation: addressUI({
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
  schema: {
    type: 'object',
    required: ['veteranBirthDate'],
    properties: {
      veteranBirthDate: currentOrPastDateSchema,
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
};
