import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-d-status-title'];
const INPUT_LABEL = content['medicare--part-d-status-label'];

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    applicantMedicareStatusD: yesNoUI(INPUT_LABEL),
  },
  schema: {
    type: 'object',
    required: ['applicantMedicareStatusD'],
    properties: {
      applicantMedicareStatusD: yesNoSchema,
    },
  },
};
