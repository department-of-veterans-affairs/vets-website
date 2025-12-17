import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';
import { healthInsurancePageTitleUI } from '../../utils/titles';
import { validFieldCharsOnly } from '../../../shared/validations';
import { textareaSchema } from '../../definitions';

const TITLE_TEXT = 'health insurance additional comments';
const INPUT_LABEL =
  'Do you have any additional comments about the beneficiary’s health insurance?';

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
