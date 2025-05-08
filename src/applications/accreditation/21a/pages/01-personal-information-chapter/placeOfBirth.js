import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Place of birth',
  path: 'place-of-birth',
  uiSchema: {
    ...titleUI('Place of birth'),
    placeOfBirth: addressNoMilitaryUI({
      omit: ['street', 'street2', 'street3', 'postalCode'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      placeOfBirth: addressNoMilitarySchema({
        omit: ['street', 'street2', 'street3', 'postalCode'],
      }),
    },
  },
};
