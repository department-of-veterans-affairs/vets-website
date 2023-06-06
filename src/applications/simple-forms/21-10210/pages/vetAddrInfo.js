import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../definitions/form-address';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranMailingAddress: uiSchema(''),
  },
  schema: {
    type: 'object',
    required: ['veteranMailingAddress'],
    properties: {
      veteranMailingAddress: schema({ definitions }, true),
    },
  },
};
