import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-c-carrier-title'];
const INPUT_LABELS = {
  carrier: content['medicare--carrier-label'],
  effectiveDate: content['medicare--part-c-effective-date-label'],
};
const HINT_TEXT = {
  carrier: content['medicare--carrier-hint--alt'],
  effectiveDate: content['medicare--part-c-effective-date-hint'],
};

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    applicantMedicarePartCCarrier: textUI({
      title: INPUT_LABELS.carrier,
      hint: HINT_TEXT.carrier,
    }),
    applicantMedicarePartCEffectiveDate: currentOrPastDateUI({
      title: INPUT_LABELS.effectiveDate,
      hint: HINT_TEXT.effectiveDate,
    }),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartCCarrier',
      'applicantMedicarePartCEffectiveDate',
    ],
    properties: {
      applicantMedicarePartCCarrier: textSchema,
      applicantMedicarePartCEffectiveDate: currentOrPastDateSchema,
    },
  },
};
