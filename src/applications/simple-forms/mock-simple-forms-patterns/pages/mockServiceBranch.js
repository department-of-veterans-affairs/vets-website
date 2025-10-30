import {
  serviceBranchUI,
  serviceBranchSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3ServiceBranchDefault: serviceBranchUI(),
    wcv3ServiceBranchCustom: serviceBranchUI({
      title: 'Service branches in the Army group',
      required: () => true,
      hint:
        'This component only includes service branches in the space force and coast guard groups',
      placeholder: 'Select a service branch',
      groups: ['space force', 'coast guard'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3ServiceBranchDefault: serviceBranchSchema(),
      wcv3ServiceBranchCustom: serviceBranchSchema([
        'space force',
        'coast guard',
      ]),
    },
  },
};
