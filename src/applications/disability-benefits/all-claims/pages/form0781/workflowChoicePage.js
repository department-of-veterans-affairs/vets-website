import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  form0781WorkflowChoiceLabels,
  form0781WorkflowChoices,
  workflowChoicePageDescription,
  workflowChoicePageTitle,
} from '../../content/form0781';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': workflowChoicePageTitle,
    pTSDWorkflowChoice: radioUI({
      description: workflowChoicePageDescription,
      errorMessages: {
        required: 'You must provide a response',
      },
      labels: form0781WorkflowChoiceLabels,
      enableAnalytics: true,
    }),
  },

  schema: {
    type: 'object',
    required: ['pTSDWorkflowChoice'],
    properties: {
      pTSDWorkflowChoice: {
        type: 'string',
        enum: Object.keys(form0781WorkflowChoices).map(
          key => form0781WorkflowChoices[key],
        ),
      },
    },
  },
};
