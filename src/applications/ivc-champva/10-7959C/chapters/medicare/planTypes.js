import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--plan-type-title'];
const INPUT_LABEL = content['medicare--plan-type-label'];

const SCHEMA_LABELS = {
  ab: content['medicare--plan-type-option--ab'],
  advantage: content['medicare--plan-type-option--advantage'],
  other: content['medicare--plan-type-option--other'],
};
const SCHEMA_ENUM = Object.keys(SCHEMA_LABELS);

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    applicantMedicareClass: radioUI({
      title: INPUT_LABEL,
      labels: SCHEMA_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantMedicareClass'],
    properties: {
      applicantMedicareClass: radioSchema(SCHEMA_ENUM),
    },
  },
};
