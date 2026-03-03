import {
  serviceBranchUI,
  serviceBranchSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3ServiceBranchDefault: serviceBranchUI(),
    wcv3ServiceBranchCustom: serviceBranchUI({
      title: 'Service branches in the Coast Guard group',
      required: () => true,
      hint:
        'This component only includes service branches in the coast guard group',
      groups: ['coast guard'],
    }),
    wcv3ServiceBranchCustomBranches: serviceBranchUI({
      title: 'Service branches taken from multiple groups',
      hint: 'This component includes branches from several different groups',
      branches: ['AAC', 'PA', 'MC', 'SF', 'PHS'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3ServiceBranchDefault: serviceBranchSchema(),
      wcv3ServiceBranchCustom: serviceBranchSchema({
        groups: ['coast guard'],
      }),
      wcv3ServiceBranchCustomBranches: serviceBranchSchema({
        branches: ['AAC', 'PA', 'MC', 'SF', 'PHS'],
      }),
    },
  },
};
