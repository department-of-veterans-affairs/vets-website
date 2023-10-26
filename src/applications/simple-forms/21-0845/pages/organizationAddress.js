import {
  titleUI,
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const addressSchema = addressNoMilitarySchema({
  omit: ['isMilitary', 'street3'],
});
addressSchema.properties.street.maxLength = 30;
addressSchema.properties.street2.maxLength = 5;
addressSchema.properties.city.maxLength = 18;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Organization’s address'),
    organizationAddress: addressNoMilitaryUI({
      labels: {
        country: 'Organization’s country',
        street: 'Organization’s street address',
        street2: 'Apartment or unit number',
      },
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      organizationAddress: addressSchema,
    },
    required: ['organizationAddress'],
  },
};

/** @type {PageSchema} */
// export default {
//   uiSchema: {
//     'ui:title': <h3 className="custom-header">Organization’s address</h3>,
//     organizationAddress: uiSchema({
//       root: '',
//       country: 'Organization’s country',
//       street: 'Organization’s street address',
//       street2: 'Apartment or unit number',
//     }),
//   },
//   schema: {
//     type: 'object',
//     required: ['organizationAddress'],
//     properties: {
//       organizationAddress: schema({ definitions }, true, 'address', {
//         street: 30,
//         street2: 5,
//         city: 18,
//       }),
//     },
//   },
// };
