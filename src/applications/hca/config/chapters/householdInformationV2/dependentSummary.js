import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { DEPENDENT_VIEW_FIELDS } from '../../../utils/constants';

const { dependents } = fullSchemaHca.properties;

export default {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      [DEPENDENT_VIEW_FIELDS.report]: { type: 'boolean' },
      dependents: {
        ...dependents,
        default: [],
      },
    },
  },
};
