import {
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { textareaSchema } from '../../definitions';
import content from '../../locales/en/content.json';
import { validateChars } from '../../utils/validation';

const TITLE_TEXT = content['resubmission--addtl-comments-title'];
const INPUT_LABEL = content['resubmission--addtl-comments-label'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    additionalComments: textareaUI({
      title: INPUT_LABEL,
      charcount: true,
      validations: [validateChars],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      additionalComments: textareaSchema,
    },
  },
};
