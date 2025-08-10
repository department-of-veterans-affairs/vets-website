import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CLAIM_OWNERSHIPS } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimOwnership: radioUI({
      title:
        'Are you submitting this statement to support your claim or someone else’s claim?',
      labelHeaderLevel: '2',
      labelHeaderLevelStyle: '3',
      labels: {
        self: 'My own claim',
        'third-party': 'Someone else’s claim',
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
