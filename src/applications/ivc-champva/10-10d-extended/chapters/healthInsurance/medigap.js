import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['health-insurance--medigap-title'];
const INPUT_LABEL = content['health-insurance--medigap-label'];
const OPTION_TEXT = content['health-insurance--medigap-option-text'];

const SCHEMA_ENUM = ['A', 'B', 'C', 'D', 'F', 'G', 'K', 'L', 'M', 'N'];
const SCHEMA_LABELS = Object.fromEntries(
  SCHEMA_ENUM.map(val => [val, `${OPTION_TEXT} ${val}`]),
);

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT),
    medigapPlan: radioUI({
      title: INPUT_LABEL,
      labels: SCHEMA_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['medigapPlan'],
    properties: {
      medigapPlan: radioSchema(SCHEMA_ENUM),
    },
  },
};
