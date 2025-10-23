import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    beneficiaryDateOfDeath: currentOrPastDateUI('Date of death'),
  },
  schema: {
    type: 'object',
    required: ['beneficiaryDateOfDeath'],
    properties: {
      beneficiaryDateOfDeath: currentOrPastDateSchema,
    },
  },
};
