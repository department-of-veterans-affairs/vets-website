import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { futureDateSchema, futureDateUI } from '../../definitions';
import { validateDateRange } from '../../utils/validation';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-d-effective-date-title'];
const INPUT_LABELS = {
  effectiveDate: content['medicare--part-d-effective-date-label'],
  terminationDate: content['medicare--part-d-termination-date-label'],
};
const HINT_TEXT = {
  effectiveDate: content['medicare--part-d-effective-date-hint'],
  terminationDate: content['medicare--part-d-termination-date-hint'],
};

const VALIDATIONS = [
  (errors, data) =>
    validateDateRange(errors, data, {
      startDateKey: 'medicarePartDEffectiveDate',
      endDateKey: 'medicarePartDTerminationDate',
    }),
];

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    medicarePartDEffectiveDate: futureDateUI({
      title: INPUT_LABELS.effectiveDate,
      hint: HINT_TEXT.effectiveDate,
    }),
    medicarePartDTerminationDate: currentOrPastDateUI({
      title: INPUT_LABELS.terminationDate,
      hint: HINT_TEXT.terminationDate,
    }),
    'ui:validations': VALIDATIONS,
  },
  schema: {
    type: 'object',
    required: ['medicarePartDEffectiveDate'],
    properties: {
      medicarePartDEffectiveDate: futureDateSchema,
      medicarePartDTerminationDate: currentOrPastDateSchema,
    },
  },
};
