import {
  serviceBranchUI,
  serviceBranchSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Select your service branch'),
    serviceBranch: serviceBranchUI({
      title: 'Service branch',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      serviceBranch: serviceBranchSchema(),
    },
    required: ['serviceBranch'],
  },
};
