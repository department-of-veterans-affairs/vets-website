import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../../shared/definitions/pdfAddress';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerAddress: uiSchema({ root: '' }),
  },
  schema: {
    type: 'object',
    required: ['authorizerAddress'],
    properties: {
      authorizerAddress: schema({ definitions }, true),
    },
  },
};
