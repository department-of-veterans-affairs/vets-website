import definitions from 'vets-json-schema/dist/definitions.json';
import {
  uiSchema,
  schema,
} from 'platform/forms-system/src/js/definitions/address';

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
