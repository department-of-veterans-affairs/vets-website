import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { StudentProgramH3 } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    studentInformation: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          schoolInformation: {
            type: 'object',
            properties: {
              name: textSchema,
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  studentInformation: {
    items: {
      'ui:title': StudentProgramH3,
      schoolInformation: {
        name: {
          ...textUI(
            'What’s the name of the school or trade program the student attends?',
          ),
          'ui:required': () => true,
          'ui:options': {
            width: 'xl',
          },
        },
      },
    },
  },
};
