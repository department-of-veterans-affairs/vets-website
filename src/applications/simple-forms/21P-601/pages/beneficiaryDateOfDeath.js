import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Beneficiary’s date of death'),
    beneficiaryDateOfDeath: currentOrPastDateUI(
      'When did the beneficiary die?',
    ),
  },
  schema: {
    type: 'object',
    required: ['beneficiaryDateOfDeath'],
    properties: {
      beneficiaryDateOfDeath: currentOrPastDateSchema,
    },
  },
};
