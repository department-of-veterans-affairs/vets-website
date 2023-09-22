import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../../shared/definitions/pdfAddress';

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
