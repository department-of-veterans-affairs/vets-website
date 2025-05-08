import {
  dateOfBirthUI,
  dateOfBirthSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
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
