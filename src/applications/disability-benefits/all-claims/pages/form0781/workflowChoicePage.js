import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import { form0781HeadingTag, titleWithTag } from '../../content/form0781';
import {
  form0781WorkflowChoiceDescription,
  form0781WorkflowChoiceLabels,
  traumaticEventsExamples,
  workflowChoicePageDescription,
  workflowChoicePageTitle,
} from '../../content/form0781/workflowChoicePage';

import { form0781WorkflowChoices } from '../../content/form0781/workflowChoices';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': titleWithTag(workflowChoicePageTitle, form0781HeadingTag),
    'ui:description': () => workflowChoicePageDescription(),
    mentalHealthWorkflowChoice: radioUI({
      title: form0781WorkflowChoiceDescription,
      labelHeaderLevel: '4',
      errorMessages: {
        required: 'You must provide a response',
      },
      labels: form0781WorkflowChoiceLabels,
      enableAnalytics: true,
    }),
    'view:traumaticEventsInfo': {
      'ui:description': traumaticEventsExamples,
    },
  },

  schema: {
    type: 'object',
    required: ['mentalHealthWorkflowChoice'],
    properties: {
      mentalHealthWorkflowChoice: {
        type: 'string',
        enum: Object.keys(form0781WorkflowChoices).map(
          key => form0781WorkflowChoices[key],
        ),
      },
      'view:traumaticEventsInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
