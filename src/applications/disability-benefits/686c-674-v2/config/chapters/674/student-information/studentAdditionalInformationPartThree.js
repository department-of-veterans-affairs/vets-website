import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { StudentMarriageH3 } from './helpers';

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
          wasMarried: yesNoSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  studentInformation: {
    items: {
      'ui:title': StudentMarriageH3,
      wasMarried: {
        ...yesNoUI('Has this student ever been married?'),
        'ui:required': () => true,
      },
    },
  },
};
