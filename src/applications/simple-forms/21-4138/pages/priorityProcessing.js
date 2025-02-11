import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import { PRIORITY_PROCESSING_HANDOFF } from '../config/constants';

/** @type {PageSchema} */
export const priorityProcessingPage = {
  uiSchema: {
    ...titleUI({
      title: 'There’s a better way to tell us you need priority processing',
      headerLevel: 2,
    }),
    'view:priorityProcessingContent': {
      'ui:description': PRIORITY_PROCESSING_HANDOFF,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:priorityProcessingContent': { type: 'object', properties: {} },
    },
  },
};
