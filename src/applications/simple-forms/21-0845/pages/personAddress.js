import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../../shared/definitions/pdfAddress';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Person’s address',
    personAddress: uiSchema({ root: '', street2: 'Apt./Unit number' }),
  },
  schema: {
    type: 'object',
    required: ['personAddress'],
    properties: {
      personAddress: schema({ definitions }, true, 'address', { street2: 5 }),
    },
  },
};
