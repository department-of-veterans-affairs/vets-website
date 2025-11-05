import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Single page: Children of Veteran
 */
const uiSchema = {
  ...titleUI('Children of Veteran'),
  expectingChild: yesNoUI({
    title: "Are you expecting the birth of the Veteran's child?",
  }),
  hadChildWithVeteran: yesNoUI({
    title:
      'Did you have a child with the Veteran before or during your marriage?',
  }),
};

const schema = {
  type: 'object',
  properties: {
    expectingChild: yesNoSchema,
    hadChildWithVeteran: yesNoSchema,
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
