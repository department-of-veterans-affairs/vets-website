import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateChars } from '../../utils/validation';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-b-carrier-title'];
const INPUT_LABELS = {
  carrier: content['medicare--carrier-label'],
  effectiveDate: content['medicare--part-b-effective-date-label'],
};
const HINT_TEXT = {
  carrier: content['medicare--carrier-hint'],
  effectiveDate: content['medicare--part-b-effective-date-hint'],
};

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    applicantMedicarePartBCarrier: textUI({
      title: INPUT_LABELS.carrier,
      hint: HINT_TEXT.carrier,
      validations: [validateChars],
    }),
    applicantMedicarePartBEffectiveDate: currentOrPastDateUI({
      title: INPUT_LABELS.effectiveDate,
      hint: HINT_TEXT.effectiveDate,
    }),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartBCarrier',
      'applicantMedicarePartBEffectiveDate',
    ],
    properties: {
      applicantMedicarePartBCarrier: textSchema,
      applicantMedicarePartBEffectiveDate: currentOrPastDateSchema,
    },
  },
};
