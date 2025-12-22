import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateChars, validateDateRange } from '../../utils/validation';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['health-insurance--provider-title'];
const PROVIDER_LABEL = content['health-insurance--provider-label'];

const INPUT_LABELS = {
  effectiveDate: content['health-insurance--effective-date-label'],
  expirationDate: content['health-insurance--termination-date-label'],
};
const HINT_TEXT = {
  effectiveDate: content['health-insurance--effective-date-hint'],
  expirationDate: content['health-insurance--termination-date-hint'],
};

const VALIDATIONS = [
  (errors, formData) =>
    validateDateRange(errors, formData, {
      startDateKey: 'effectiveDate',
      endDateKey: 'expirationDate',
    }),
];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT),
    provider: textUI({ title: PROVIDER_LABEL, validations: [validateChars] }),
    effectiveDate: currentOrPastDateUI({
      title: INPUT_LABELS.effectiveDate,
      hint: HINT_TEXT.effectiveDate,
    }),
    expirationDate: currentOrPastDateUI({
      title: INPUT_LABELS.expirationDate,
      hint: HINT_TEXT.expirationDate,
    }),
    'ui:validations': VALIDATIONS,
  },
  schema: {
    type: 'object',
    required: ['provider', 'effectiveDate'],
    properties: {
      provider: textSchema,
      effectiveDate: currentOrPastDateSchema,
      expirationDate: currentOrPastDateSchema,
    },
  },
};
