import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const TITLE_TEXT = 'Report Medicare Plans';
const INPUT_LABEL =
  'Does the beneficiary have Medicare information to provide or update at this time?';

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
