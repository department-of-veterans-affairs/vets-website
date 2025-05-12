import {
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { claimantTypeLabels } from '../../../labels';

/** @type {PageSchema} */
export default {
  title: 'Claimant type',
  path: 'claimant/type',
  uiSchema: {
    claimantType: radioUI({
      title: 'Which of these best describes you?',
      labelHeaderLevel: '4',
      labels: claimantTypeLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      claimantType: radioSchema(Object.keys(claimantTypeLabels)),
    },
    required: ['claimantType'],
  },
};
