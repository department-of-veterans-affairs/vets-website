import {
  titleUI,
  selectUI,
  selectSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const relationshipOptions = {
  spouse: 'Surviving spouse',
  child: 'Child',
  parent: 'Parent',
  executor: 'Executor/Administrator of estate',
  creditor: 'Creditor (for reimbursement of expenses)',
};

export default {
  uiSchema: {
    ...titleUI('Your relationship to the deceased'),
    relationshipToDeceased: selectUI(
      'What is your relationship to the deceased beneficiary?',
    ),
    'view:substitutionInfo': {
      'ui:description':
        'If the deceased had a pending claim or appeal, you may request to substitute for them to continue that claim.',
    },
    wantsToWaiveSubstitution: yesNoUI(
      'Do you want to waive your right to substitute for any pending claims?',
    ),
  },
  schema: {
    type: 'object',
    required: ['relationshipToDeceased'],
    properties: {
      relationshipToDeceased: selectSchema(Object.keys(relationshipOptions)),
      'view:substitutionInfo': {
        type: 'object',
        properties: {},
      },
      wantsToWaiveSubstitution: yesNoSchema,
    },
  },
  relationshipOptions,
};
