import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicant--birth-sex-title'];
const INPUT_LABEL = content['applicant--birth-sex-label'];
const HINT_TEXT = content['applicant--birth-sex-hint'];

const SCHEMA_ENUM = ['female', 'male'];
const SCHEMA_LABELS = Object.fromEntries(
  SCHEMA_ENUM.map(key => [key, key.charAt(0).toUpperCase() + key.slice(1)]),
);

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    applicantGender: radioUI({
      title: INPUT_LABEL,
      hint: HINT_TEXT,
      labels: SCHEMA_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantGender'],
    properties: {
      applicantGender: radioSchema(SCHEMA_ENUM),
    },
  },
};
