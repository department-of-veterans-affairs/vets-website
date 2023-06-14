import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../definitions/form-address';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Person’s address',
    personAddress: uiSchema(''),
  },
  schema: {
    type: 'object',
    required: ['personAddress'],
    properties: {
      personAddress: schema({ definitions }, true),
    },
  },
};
