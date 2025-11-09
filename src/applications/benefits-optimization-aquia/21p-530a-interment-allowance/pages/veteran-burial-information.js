import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranBurialInformationPage = {
  uiSchema: {
    ...titleUI('Veteran’s burial information'),
    veteranInformation: {
      dateOfDeath: currentOrPastDateUI('Date of death'),
    },
    burialInformation: {
      dateOfBurial: currentOrPastDateUI('Date of burial'),
      placeOfBurial: {
        stateCemeteryOrTribalCemeteryName: textUI('Cemetery Name'),
        cemeteryLocation: addressUI({
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
  },
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        required: ['dateOfDeath'],
        properties: {
          dateOfDeath: currentOrPastDateSchema,
        },
      },
      burialInformation: {
        type: 'object',
        required: ['dateOfBurial'],
        properties: {
          dateOfBurial: currentOrPastDateSchema,
          placeOfBurial: {
            type: 'object',
            required: ['stateCemeteryOrTribalCemeteryName', 'cemeteryLocation'],
            properties: {
              stateCemeteryOrTribalCemeteryName: textSchema,
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
        },
      },
    },
  },
};
