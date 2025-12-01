import {
  arrayBuilderItemFirstPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['health-insurance--plan-type-title'];
const INPUT_LABEL = content['health-insurance--plan-type-label'];
const HINT_TEXT = content['health-insurance--plan-type-hint'];

export const TYPE_LABELS = {
  hmo: content['health-insurance--plan-type-option--hmo'],
  ppo: content['health-insurance--plan-type-option--ppo'],
  medicaid: content['health-insurance--plan-type-option--medicaid'],
  medigap: content['health-insurance--plan-type-option--medigap'],
  other: content['health-insurance--plan-type-option--other'],
};
const SCHEMA_VALUES = Object.values(TYPE_LABELS);

export default {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({ title: TITLE_TEXT }),
    insuranceType: radioUI({
      title: INPUT_LABEL,
      hint: HINT_TEXT,
      labels: TYPE_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['insuranceType'],
    properties: {
      insuranceType: radioSchema(SCHEMA_VALUES),
    },
  },
};
