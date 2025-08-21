import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Array builder pattern type'),
    arrayBuilderPatternFlowType: radioUI({
      title: 'Choose array builder pattern type',
      labels: {
        required: 'Required flow',
        optional: 'Optional flow',
      },
      descriptions: {
        required:
          'Must provide at least one item. Starts with an "intro" page of text explaining that the user will be going through a loop.',
        optional: 'User can skip the array starting with a yes/no question.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      arrayBuilderPatternFlowType: radioSchema(['required', 'optional']),
    },
    required: ['arrayBuilderPatternFlowType'],
  },
};
