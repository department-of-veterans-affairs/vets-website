import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validFieldCharsOnly } from '../../../shared/validations';
import { validateDateRange } from '../../utils/validation';

const TITLE_TEXT = 'Health insurance information';
const PROVIDER_LABEL = 'Name of insurance provider';

const INPUT_LABELS = {
  effectiveDate: 'Insurance start date',
  expirationDate: 'Insurance termination date',
};
const HINT_TEXT = {
  effectiveDate:
    'This information is on the insurance policy declarations page.',
  expirationDate: 'Only enter this date if the policy is inactive.',
};

const VALIDATIONS = [
  (errors, formData) => validFieldCharsOnly(errors, null, formData, 'provider'),
  (errors, formData) =>
    validateDateRange(errors, formData, {
      startDateKey: 'effectiveDate',
      endDateKey: 'expirationDate',
    }),
];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT),
    provider: textUI(PROVIDER_LABEL),
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
