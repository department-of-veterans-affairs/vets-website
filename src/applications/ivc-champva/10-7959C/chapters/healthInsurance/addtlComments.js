import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';
import { healthInsurancePageTitleUI } from '../../utils/titles';
import { validFieldCharsOnly } from '../../../shared/validations';
import { textareaSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['health-insurance--addtl-comments-title'];
const INPUT_LABEL = content['health-insurance--addtl-comments-label'];

const VALIDATIONS = [
  (errors, formData) =>
    validFieldCharsOnly(errors, null, formData, 'additionalComments'),
];

export default {
  uiSchema: {
    ...healthInsurancePageTitleUI(TITLE_TEXT),
    additionalComments: textareaUI({
      title: INPUT_LABEL,
      charcount: true,
    }),
    'ui:validations': VALIDATIONS,
  },
  schema: {
    type: 'object',
    properties: {
      additionalComments: textareaSchema,
    },
  },
};
