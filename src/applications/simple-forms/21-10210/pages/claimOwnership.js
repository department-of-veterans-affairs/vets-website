import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CLAIM_OWNERSHIPS } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimOwnership: radioUI({
      labelHeaderLevel: '2',
      labelHeaderLevelStyle: '3',
      labels: {
        [CLAIM_OWNERSHIPS.SELF]: 'My own claim',
        [CLAIM_OWNERSHIPS.THIRD_PARTY]: 'Someone else’s claim',
      },
      updateSchema: (formData, schema, uiSchema) => {
        return {
          title:
            'Are you submitting this statement to support your claim or someone else’s claim?',
          uiSchema,
        };
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimOwnership'],
    properties: {
      claimOwnership: radioSchema([
        CLAIM_OWNERSHIPS.SELF,
        CLAIM_OWNERSHIPS.THIRD_PARTY,
      ]),
    },
  },
};
