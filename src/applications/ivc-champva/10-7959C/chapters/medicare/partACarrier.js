import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import { validateChars } from '../../utils/validation';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-a-carrier-title'];
const INPUT_LABELS = {
  carrier: content['medicare--carrier-label'],
  effectiveDate: content['medicare--part-a-effective-date-label'],
};
const HINT_TEXT = {
  carrier: content['medicare--carrier-hint'],
  effectiveDate: content['medicare--part-a-effective-date-hint'],
};

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    applicantMedicarePartACarrier: textUI({
      title: INPUT_LABELS.carrier,
      hint: HINT_TEXT.carrier,
      validations: [validateChars],
    }),
    applicantMedicarePartAEffectiveDate: currentOrPastDateUI({
      title: INPUT_LABELS.effectiveDate,
      hint: HINT_TEXT.effectiveDate,
    }),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartACarrier',
      'applicantMedicarePartAEffectiveDate',
    ],
    properties: {
      applicantMedicarePartACarrier: textSchema,
      applicantMedicarePartAEffectiveDate: currentOrPastDateSchema,
    },
  },
};
