import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { INSURANCE_VIEW_FIELDS } from '../../../utils/constants';

const { providers } = ezrSchema.properties;

export default {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      [INSURANCE_VIEW_FIELDS.add]: { type: 'boolean' },
      providers: {
        ...providers,
        default: [],
      },
    },
  },
};
