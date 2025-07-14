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
    },
    required: [
      'arrayBuilderPatternFlowType',
      'arrayBuilderPatternInteractionType',
    ],
  },
};
