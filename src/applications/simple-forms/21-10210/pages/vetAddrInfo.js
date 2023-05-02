import definitions from 'vets-json-schema/dist/definitions.json';
import {
  uiSchema,
  schema,
} from 'platform/forms-system/src/js/definitions/address';

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
