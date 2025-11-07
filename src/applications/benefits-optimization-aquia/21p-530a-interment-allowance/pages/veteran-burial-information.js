import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    veteranDeathDate: currentOrPastDateUI('Date of death'),
    veteranBurialDate: currentOrPastDateUI('Date of burial'),
    cemeteryName: textUI('Name'),
    cemeteryLocation: addressUI({
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
    required: [
      'veteranDeathDate',
      'veteranBurialDate',
      'cemeteryName',
      'cemeteryLocation',
    ],
    properties: {
      veteranDeathDate: currentOrPastDateSchema,
      veteranBurialDate: currentOrPastDateSchema,
      cemeteryName: textSchema,
      cemeteryLocation: addressSchema({
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
