import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

const TITLE_TEXT = 'Medicare plan types';
const INPUT_LABEL = 'Which Medicare plan does the beneficiary have?';

const RADIO_LABELS = {
  ab: 'Original Medicare Parts A and B (hospital and medical coverage)',
  advantage: 'Medicare Advantage Plan (Part C)',
  other: 'Other Medicare plan',
};
const SCHEMA_ENUM = Object.keys(RADIO_LABELS);

const PAGE_TITLE = ({ formData }) => {
  const name = nameWording(formData, undefined, undefined, true);
  return privWrapper(`${name} ${TITLE_TEXT}`);
};

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
    applicantMedicareClass: radioUI({
      title: INPUT_LABEL,
      labels: RADIO_LABELS,
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
