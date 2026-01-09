import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--general-pharmacy-title'];
const INPUT_LABEL = content['medicare--general-pharmacy-label'];
const HINT_TEXT = content['medicare--general-pharmacy-hint'];

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    applicantMedicarePharmacyBenefits: yesNoUI({
      title: INPUT_LABEL,
      hint: HINT_TEXT,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantMedicarePharmacyBenefits'],
    properties: {
      applicantMedicarePharmacyBenefits: yesNoSchema,
    },
  },
};
