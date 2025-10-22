import {
  textareaSchema,
  textareaUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { CLAIMANT_TYPES, CLAIM_OWNERSHIPS } from '../definitions/constants';

// for ALL Flows
/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(formData => {
      const { claimOwnership, claimantType } = formData;

      if (claimantType === CLAIMANT_TYPES.VETERAN) {
        return claimOwnership === CLAIM_OWNERSHIPS.SELF
          ? // Flow 1: self claim, vet claimant
            'Provide your statement'
          : // Flow 2: 3rd-party claim, vet claimant
            'Tell us about the claimed issue that you’re addressing on behalf of the Veteran';
      }
      // Flows 3 & 4: non-vet claimant
      return 'Tell us about the claimed issue that you’re addressing';
    }),
    statement: textareaUI({
      updateSchema: formData => {
        const { claimOwnership, claimantType } = formData;
        let title =
          'Describe what you know or have observed about the facts or circumstances relevant to this claim before VA.'; // Flows 2-4

        if (
          claimOwnership === CLAIM_OWNERSHIPS.SELF &&
          claimantType === CLAIMANT_TYPES.VETERAN
        ) {
          // Flow 1: self claim, vet claimant
          title =
            'Tell us what you think we need to know about the facts or circumstances relevant to your claim. Include any information that we don’t already have and that you think may support your claim.';
        }

        return { title };
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['statement'],
    properties: {
      statement: textareaSchema,
    },
  },
};
