import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--report-plan-title'];
const INPUT_LABEL = content['medicare--report-plan-label'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    applicantMedicareStatus: yesNoUI(INPUT_LABEL),
  },
  schema: {
    type: 'object',
    required: ['applicantMedicareStatus'],
    properties: {
      applicantMedicareStatus: yesNoSchema,
    },
  },
};
