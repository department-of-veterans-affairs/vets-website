import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { claimantTypeLabels } from '../../../labels';

/** @type {PageSchema} */
export default {
  title: 'Claimant type',
  path: 'claimant/type',
  uiSchema: {
    claimantType: radioUI({
      title: 'What is the type of claimant?',
      labels: claimantTypeLabels,
      errorMessages: {
        required: 'Please select a type',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantType'],
    properties: {
      claimantType: radioSchema(Object.keys(claimantTypeLabels)),
    },
  },
};
