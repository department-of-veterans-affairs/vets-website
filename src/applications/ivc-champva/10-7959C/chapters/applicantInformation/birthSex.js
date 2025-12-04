import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

const TITLE_TEXT = 'sex listed at birth';
const INPUT_LABEL = 'What’s the beneficiary’s sex listed at birth?';
const HINT_TEXT =
  'Enter the sex that appears on the beneficiary’s birth certificate';

const SCHEMA_ENUM = ['female', 'male'];
const SCHEMA_LABELS = Object.fromEntries(
  SCHEMA_ENUM.map(key => [key, key.charAt(0).toUpperCase() + key.slice(1)]),
);

const PAGE_TITLE = ({ formData }) =>
  privWrapper(
    `${nameWording(formData, undefined, undefined, true)} ${TITLE_TEXT}`,
  );

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
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
      applicantGender: radioSchema(['male', 'female']),
    },
  },
};
