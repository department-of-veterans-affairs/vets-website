import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../../shared/definitions/pdfAddress';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantMailingAddress: uiSchema(''),
  },
  schema: {
    type: 'object',
    required: ['claimantMailingAddress'],
    properties: {
      claimantMailingAddress: schema({ definitions }, true),
    },
  },
};
