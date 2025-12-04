import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CLAIMANT_TYPES, OTHER_RELATIONSHIP } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    witnessOtherRelationshipToClaimant: textUI({
      charcount: true,
      updateSchema: formData => {
        const { claimantType, witnessRelationshipToClaimant } = formData;

        if (
          witnessRelationshipToClaimant &&
          !witnessRelationshipToClaimant[OTHER_RELATIONSHIP]
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
                'Since your relationship with the Veteran was not listed, please describe it here'
              : // Flow 4: non-vet claimant
                'Since your relationship with the Claimant was not listed, please describe it here',
        };
      },
    }),
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
        ...textSchema,
        maxLength: 30,
      },
    },
  },
};
