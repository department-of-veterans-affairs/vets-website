import {
  titleUI,
  currentOrPastDateDigitsUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Beneficiary’s date of death'),
    beneficiaryDateOfDeath: currentOrPastDateDigitsUI(
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
