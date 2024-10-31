import {
  ssnUI,
  ssnSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { StudentInfoH3 } from './helpers';

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
          ssn: ssnSchema,
          isParent: yesNoSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  studentInformation: {
    items: {
      'ui:title': StudentInfoH3,
      ssn: {
        ...ssnUI('Student’s Social Security number'),
        'ui:required': () => true,
      },
      isParent: {
        ...yesNoUI('Are you this student’s parent?'),
        'ui:required': () => true,
      },
    },
  },
};
