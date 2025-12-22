import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';
import { healthInsurancePageTitleUI } from '../../utils/titles';
import { validateChars } from '../../utils/validation';
import { textareaSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['health-insurance--addtl-comments-title'];
const INPUT_LABEL = content['health-insurance--addtl-comments-label'];

export default {
  uiSchema: {
    ...healthInsurancePageTitleUI(TITLE_TEXT),
    additionalComments: textareaUI({
      title: INPUT_LABEL,
      validations: [validateChars],
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      additionalComments: textareaSchema,
    },
  },
};
