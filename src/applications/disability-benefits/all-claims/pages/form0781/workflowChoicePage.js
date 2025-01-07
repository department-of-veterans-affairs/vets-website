import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import { form0781HeadingTag, titleWithTag } from '../../content/form0781';
import {
  form0781WorkflowChoiceLabels,
  form0781WorkflowChoices,
  workflowChoicePageDescription,
  workflowChoicePageTitle,
} from '../../content/form0781/workflowChoicePage';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': titleWithTag(workflowChoicePageTitle, form0781HeadingTag),
    'view:mentalHealthWorkflowChoice': radioUI({
      title: 'CHOICE TITLE',
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
    required: ['view:mentalHealthWorkflowChoice'],
    properties: {
      'view:mentalHealthWorkflowChoice': {
        type: 'string',
        enum: Object.keys(form0781WorkflowChoices).map(
          key => form0781WorkflowChoices[key],
        ),
      },
    },
  },
};
