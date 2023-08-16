import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../../shared/definitions/pdfAddress';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerAddress: uiSchema({
      root: '',
      street2: 'Apartment or unit number',
    }),
  },
  schema: {
    type: 'object',
    required: ['authorizerAddress'],
    properties: {
      authorizerAddress: schema({ definitions }, true, 'address', {
        street: 30,
        street2: 5,
        city: 18,
      }),
    },
  },
};
