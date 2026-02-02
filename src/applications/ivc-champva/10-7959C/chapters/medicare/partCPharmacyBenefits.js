import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-c-pharmacy-title'];
const INPUT_LABEL = content['medicare--part-c-pharmacy-label'];
const HINT_TEXT = content['medicare--part-c-pharmacy-hint'];

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    medicarePharmacyBenefits: yesNoUI({
      title: INPUT_LABEL,
      hint: HINT_TEXT,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePharmacyBenefits'],
    properties: {
      medicarePharmacyBenefits: yesNoSchema,
    },
  },
};
