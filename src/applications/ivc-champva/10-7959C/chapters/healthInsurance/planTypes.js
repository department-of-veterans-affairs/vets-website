import {
  arrayBuilderItemFirstPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const TITLE_TEXT = 'Private or employer-sponsored insurance plan';
const INPUT_LABEL =
  'Which type of insurance plan or program is the beneficiary enrolled in?';
const HINT_TEXT =
  'This information is on the front of your health insurance card.';

export const SCHEMA_LABELS = {
  hmo: 'Health Maintenance Organization (HMO) program',
  ppo: 'Preferred Provider Organization (PPO) plan',
  medicaid: 'Medicaid or a state assistance program',
  medigap: 'Medigap policy',
  other:
    'Other (specialty, limited coverage, or exclusively CHAMPVA supplemental) insurance',
};
const SCHEMA_ENUM = Object.keys(SCHEMA_LABELS);

export default {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({ title: TITLE_TEXT }),
    insuranceType: radioUI({
      title: INPUT_LABEL,
      hint: HINT_TEXT,
      labels: SCHEMA_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['insuranceType'],
    properties: {
      insuranceType: radioSchema(SCHEMA_ENUM),
    },
  },
};
