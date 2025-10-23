import { CLAIMANT_TYPES, OTHER_RELATIONSHIP } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    witnessOtherRelationshipToClaimant: {
      'ui:title':
        'Since your relationship with the Veteran was not listed, please describe it here (30 characters maximum)',
      'ui:autocomplete': 'off',
      'ui:options': {
        updateSchema: formData => {
          const { claimantType, witnessRelationshipToClaimant } = formData;

          if (
            witnessRelationshipToClaimant &&
            !witnessRelationshipToClaimant.includes(OTHER_RELATIONSHIP)
          ) {
            // Clear witnessOtherRelationshipToClaimant if User returns
            // to previous page & deselects OTHER_RELATIONSHIP.
            // eslint-disable-next-line no-param-reassign
            formData.witnessOtherRelationshipToClaimant = undefined;
          }

          return {
            title:
              claimantType === CLAIMANT_TYPES.VETERAN
                ? // Flow 2: vet claimant
                  'Since your relationship with the Veteran was not listed, please describe it here (30 characters maximum)'
                : // Flow 4: non-vet claimant
                  'Since your relationship with the Claimant was not listed, please describe it here (30 characters maximum)',
          };
        },
      },
    },
  },
  // uiSchemaB: {
  //   // Flow 4: non-vet claimant
  //   ...commonUiSchema,
  //   witnessOtherRelationshipToClaimant: {
  //     ...commonUiSchema.witnessOtherRelationshipToClaimant,
  //     'ui:title':
  //       'Since your relationship with the Claimant was not listed, please describe it here (30 characters maximum)',
  //   },
  // },
  schema: {
    type: 'object',
    required: ['witnessOtherRelationshipToClaimant'],
    properties: {
      witnessOtherRelationshipToClaimant: {
        type: 'string',
        maxLength: 30,
      },
    },
  },
};
