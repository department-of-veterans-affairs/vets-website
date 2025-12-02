import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantWording } from '../../../shared/utilities';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--birth-sex-title'];
const INPUT_LABEL = content['applicants--birth-sex-label'];
const HINT_TEXT = content['applicants--birth-sex-hint'];

const SCHEMA_ENUM = ['female', 'male'];
const SCHEMA_LABELS = Object.fromEntries(
  SCHEMA_ENUM.map(key => [key, key.charAt(0).toUpperCase() + key.slice(1)]),
);

const PAGE_TITLE = ({ formData }) =>
  `${applicantWording(formData)} ${TITLE_TEXT}`;

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(PAGE_TITLE, null, false),
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
