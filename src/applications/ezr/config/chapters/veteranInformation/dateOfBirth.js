import {
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    veteranDateOfBirth: dateOfBirthUI(content['vet-date-of-birth-label']),
  },
  schema: {
    type: 'object',
    required: ['veteranDateOfBirth'],
    properties: {
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
