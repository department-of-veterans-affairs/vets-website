import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    relationshipToDeceasedClaimant: {
      'ui:title': 'What’s your relationship to the deceased claimant?',
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          spouse: 'Spouse',
          child: 'Child',
          parent: 'Parent',
          executor: 'Executor/Administrator of Estate',
          other: 'A relationship not listed here',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToDeceasedClaimant: {
        type: 'string',
        enum: ['spouse', 'child', 'parent', 'executor', 'other'],
      },
    },
    required: ['relationshipToDeceasedClaimant'],
  },
};
