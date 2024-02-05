import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { EMERGENCY_CONTACT_VIEW_FIELDS } from '../../../utils/constants';

const { veteranContacts } = ezrSchema.properties;

export default {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      [EMERGENCY_CONTACT_VIEW_FIELDS.add]: { type: 'boolean' },
      veteranContacts: {
        ...veteranContacts,
        default: [],
      },
    },
  },
};
