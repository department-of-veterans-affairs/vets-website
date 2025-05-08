import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { yesNoSchema } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { DEPENDENT_VIEW_FIELDS } from '../../../utils/constants';

const { dependents } = ezrSchema.properties;

export default {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      [DEPENDENT_VIEW_FIELDS.add]: yesNoSchema,
      dependents: {
        ...dependents,
        default: [],
      },
    },
  },
};
