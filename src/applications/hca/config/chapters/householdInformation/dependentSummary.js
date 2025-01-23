import { DEPENDENT_VIEW_FIELDS } from '../../../utils/constants';
import { FULL_SCHEMA } from '../../../utils/imports';

const { dependents } = FULL_SCHEMA.properties;

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
