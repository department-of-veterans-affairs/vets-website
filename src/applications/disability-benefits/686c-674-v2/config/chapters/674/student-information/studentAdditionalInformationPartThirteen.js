import {
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { RemarksH3 } from './helpers';

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
          remarks: textareaSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  studentInformation: {
    items: {
      'ui:title': RemarksH3,
      remarks: textareaUI(
        'Is there any other information you’d like to add about this student?',
      ),
    },
  },
};
