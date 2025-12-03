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
          'User must provide at least one item. Starts with an "intro" page of text explaining that the user will be going through a loop.',
        optional:
          'User can skip the array entirely, starting with a yes/no question.',
      },
    }),
    arrayBuilderPatternInteractionType: radioUI({
      title: 'Choose array builder pattern interaction type',
      labels: {
        yesNoQuestion: 'Yes/no question',
        addButton: 'Add button',
        addLink: 'Add link',
      },
    }),
    arrayBuilderItemPages: radioUI({
      title: 'Item pages complexity',
      labels: {
        simple: 'Simple (1 page)',
        complex: 'Complex (2+ pages)',
      },
      descriptions: {
        simple: 'Single item page with just a name field',
        complex:
          'Multiple item pages (name/address, dates, optional conditional page)',
      },
    }),
    arrayBuilderSummaryIntroVariation: radioUI({
      title: 'Summary/intro page variation',
      labels: {
        A: 'Variation A',
        B: 'Variation B',
      },
      descriptions: {
        A: 'Summary/intro page with variation A text and styling',
        B: 'Summary/intro page with variation B text and styling',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      arrayBuilderPatternFlowType: radioSchema(['required', 'optional']),
      arrayBuilderPatternInteractionType: radioSchema([
        'yesNoQuestion',
        'addButton',
        'addLink',
      ]),
      arrayBuilderItemPages: radioSchema(['simple', 'complex']),
      arrayBuilderSummaryIntroVariation: radioSchema(['A', 'B']),
    },
    required: [
      'arrayBuilderPatternFlowType',
      'arrayBuilderPatternInteractionType',
      'arrayBuilderItemPages',
      'arrayBuilderSummaryIntroVariation',
    ],
  },
};
