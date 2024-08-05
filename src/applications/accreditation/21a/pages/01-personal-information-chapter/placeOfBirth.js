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
      omit: ['street', 'street2', 'street3', 'postalCode'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      placeOfBirthAddress: addressNoMilitarySchema({
        omit: ['street', 'street2', 'street3', 'postalCode'],
      }),
    },
  },
};
