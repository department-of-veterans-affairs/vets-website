import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns/';
import { relationshipToVeteranKeys } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    relationshipToVeteran: radioUI({
      title: 'What’s the claimant’s relationship to the Veteran?',
      labels: {
        SPOUSE: 'The claimant is the Veteran’s spouse.',
        CHILD: 'The claimant is the Veteran’s child.',
      },
      labelHeaderLevel: '3',
      // TODO: Add correct error message
      errorMessages: {
        required: '',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['relationshipToVeteran'],
    properties: {
      relationshipToVeteran: radioSchema(relationshipToVeteranKeys),
    },
  },
};
