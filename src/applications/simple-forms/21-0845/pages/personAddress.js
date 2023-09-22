import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../../shared/definitions/pdfAddress';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Person’s address',
    personAddress: uiSchema({
      root: '',
      street2: 'Apartment or unit number',
    }),
  },
  schema: {
    type: 'object',
    required: ['personAddress'],
    properties: {
      personAddress: schema({ definitions }, true, 'address', {
        street: 30,
        street2: 5,
        city: 18,
      }),
    },
  },
};
