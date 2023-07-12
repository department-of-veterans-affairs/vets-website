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
          spouse: 'I’m the deceased claimant’s spouse',
          child: 'I’m the deceased claimant’s child',
          parent: 'I’m the deceased claimant’s parent',
          executor:
            'I’m the deceased claimant’s executor or administrator of estate',
          other: 'We don’t have a relationship that’s listed here',
        },
      },
    },
    // TODO: use popup from Nick's pattern
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
