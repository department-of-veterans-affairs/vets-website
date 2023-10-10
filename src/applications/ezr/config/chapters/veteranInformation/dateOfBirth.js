import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import { dateOfBirthUI } from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

const { date } = ezrSchema.definitions;

export default {
  uiSchema: {
    veteranDateOfBirth: dateOfBirthUI(content['vet-date-of-birth-label']),
  },
  schema: {
    type: 'object',
    required: ['veteranDateOfBirth'],
    properties: {
      veteranDateOfBirth: date,
    },
  },
};
