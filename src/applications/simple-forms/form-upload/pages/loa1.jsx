import {
  addressSchema,
  addressUI,
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const identificationInformationPage = {
  uiSchema: {
    ...titleUI({
      title: 'Identification information',
      description:
        'You must enter either a Social Security number or VA File number',
      headerLevel: 1,
    }),
    idNumber: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      idNumber: ssnOrVaFileNumberNoHintSchema,
    },
  },
};

/** @type {PageSchema} */
export const zipCodePage = {
  uiSchema: {
    ...titleUI({
      title: 'Your zip code',
      description:
        'We use your zip code to send your form to the right place for processing.',
      headerLevel: 1,
    }),
    address: addressUI({
      labels: {
        postalCode: 'Zip code',
      },
      omit: [
        'country',
        'city',
        'isMilitary',
        'state',
        'street',
        'street2',
        'street3',
      ],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({
        omit: [
          'country',
          'city',
          'isMilitary',
          'state',
          'street',
          'street2',
          'street3',
        ],
      }),
    },
  },
};
