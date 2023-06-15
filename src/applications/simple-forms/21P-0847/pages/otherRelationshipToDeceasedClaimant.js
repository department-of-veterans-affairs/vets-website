import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    otherRelationshipToDeceasedClaimant: {
      'ui:title':
        'Since your relationship to the deceased claimant was not listed, please describe it here',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Please enter a value',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherRelationshipToDeceasedClaimant: {
        type: 'string',
      },
    },
    required: ['otherRelationshipToDeceasedClaimant'],
  },
};
