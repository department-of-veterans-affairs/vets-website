import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../definitions/form-address';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Your address',
    authorizerAddress: uiSchema(''),
  },
  schema: {
    type: 'object',
    required: ['authorizerAddress'],
    properties: {
      authorizerAddress: schema({ definitions }, true),
    },
  },
};
