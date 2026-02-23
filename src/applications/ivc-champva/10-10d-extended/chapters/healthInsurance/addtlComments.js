import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';
import { validFieldCharsOnly } from '../../../shared/validations';
import { textareaSchema } from '../../definitions';
import { healthInsurancePageTitleUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['health-insurance--addtl-comments-title'];
const INPUT_LABEL = content['health-insurance--addtl-comments-label'];
const HINT_TEXT = content['health-insurance--addtl-comments-hint'];

export default {
  uiSchema: {
    ...healthInsurancePageTitleUI(TITLE_TEXT),
    additionalComments: textareaUI({
      title: INPUT_LABEL,
      hint: HINT_TEXT,
      charcount: true,
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(errors, null, formData, 'additionalComments'),
    ],
  },
  schema: {
    type: 'object',
    properties: {
      additionalComments: textareaSchema,
    },
  },
};
