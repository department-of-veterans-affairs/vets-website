import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../../shared/definitions/pdf-address';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Organization’s address',
    organizationAddress: uiSchema({
      root: '',
      country: 'Organization’s country',
      street: 'Organization’s street address',
    }),
  },
  schema: {
    type: 'object',
    required: ['organizationAddress'],
    properties: {
      organizationAddress: schema({ definitions }, true),
    },
  },
};
