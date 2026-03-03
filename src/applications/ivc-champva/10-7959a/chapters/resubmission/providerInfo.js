import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateChars, validateDateRange } from '../../utils/validation';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['resubmission--provider-title'];
const DESC_TEXT = content['resubmission--provider-description'];

const INPUT_LABELS = {
  provider: content['resubmission--provider-label'],
  startDate: content['resubmission--service-start-date-label'],
  endDate: content['resubmission--service-end-date-label'],
};
const HINT_TEXT = {
  startDate: content['resubmission--service-start-date-hint'],
  endDate: content['resubmission--service-end-date-hint'],
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, DESC_TEXT),
    serviceProvider: textUI({
      title: INPUT_LABELS.provider,
      validations: [validateChars],
    }),
    serviceStartDate: currentOrPastDateUI({
      title: INPUT_LABELS.effectiveDate,
      hint: HINT_TEXT.effectiveDate,
    }),
    serviceEndDate: currentOrPastDateUI({
      title: INPUT_LABELS.expirationDate,
      hint: HINT_TEXT.expirationDate,
    }),
    'ui:validations': [
      validateDateRange({
        startDateKey: 'serviceStartDate',
        endDateKey: 'serviceEndDate',
      }),
    ],
  },
  schema: {
    type: 'object',
    required: ['serviceProvider', 'serviceStartDate'],
    properties: {
      serviceProvider: textSchema,
      serviceStartDate: currentOrPastDateSchema,
      serviceEndDate: currentOrPastDateSchema,
    },
  },
};
