import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const TITLE_TEXT = 'Medigap information';
const INPUT_LABEL = 'Select the Medigap policy the beneficiary is enrolled in.';

const SCHEMA_LABELS = {
  A: 'Medigap Plan A',
  B: 'Medigap Plan B',
  C: 'Medigap Plan C',
  D: 'Medigap Plan D',
  F: 'Medigap Plan F',
  G: 'Medigap Plan G',
  K: 'Medigap Plan K',
  L: 'Medigap Plan L',
  M: 'Medigap Plan M',
  N: 'Medigap Plan N',
};
const SCHEMA_ENUM = Object.keys(SCHEMA_LABELS);

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
