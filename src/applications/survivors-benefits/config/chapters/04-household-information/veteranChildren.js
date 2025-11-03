import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Single page: Children of Veteran
 */
const uiSchema = {
  ...titleUI('Children of Veteran'),
  expectingChild: radioUI({
    title: "Are you expecting the birth of the Veteran's child?",
    labels: { YES: 'Yes', NO: 'No' },
  }),
  hadChildWithVeteran: radioUI({
    title:
      'Did you have a child with the Veteran before or during your marriage?',
    labels: { YES: 'Yes', NO: 'No' },
  }),
};

const schema = {
  type: 'object',
  properties: {
    expectingChild: radioSchema(['YES', 'NO']),
    hadChildWithVeteran: radioSchema(['YES', 'NO']),
  },
  required: ['expectingChild', 'hadChildWithVeteran'],
};

const veteranChildren = {
  path: 'household/children-of-veteran',
  title: 'Children of Veteran',
  uiSchema,
  schema,
};

export default veteranChildren;
