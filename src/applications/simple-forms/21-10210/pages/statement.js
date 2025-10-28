import {
  textareaSchema,
  textareaUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import StatementUiTitle from 'applications/simple-forms/21-10210/components/StatementUiTitle';
import { CLAIMANT_TYPES, CLAIM_OWNERSHIPS } from '../definitions/constants';

// for ALL Flows
/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(StatementUiTitle),
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
