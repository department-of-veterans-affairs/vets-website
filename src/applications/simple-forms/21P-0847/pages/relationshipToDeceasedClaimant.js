import {
  relationshipToVeteranUI,
  relationshipToVeteranSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    relationshipToDeceasedClaimant: relationshipToVeteranUI(
      'deceased claimant',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToDeceasedClaimant: relationshipToVeteranSchema,
    },
    required: ['relationshipToDeceasedClaimant'],
  },
};
