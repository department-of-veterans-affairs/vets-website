import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Place of birth',
  path: 'place-of-birth',
  uiSchema: {
    ...titleUI('Place of birth'),
    placeOfBirthAddress: addressNoMilitaryUI({
      labels: {
        state: 'State/Province/Region',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      placeOfBirthAddress: addressNoMilitarySchema({
        omit: ['street2', 'street3'], // TODO: Inquire about allowing omitting 'street' and 'postalCode'
      }),
    },
  },
};
