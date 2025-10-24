import {
  serviceBranchUI,
  serviceBranchSchema,
  ARMY_BRANCH_LABELS,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3ServiceBranchDefault: serviceBranchUI(),
    wcv3ServiceBranchCustom: serviceBranchUI({
      title: 'Service branches in the Army group',
      required: () => true,
      hint: 'Choose from a custom list of service branches related to the Army',
      placeholder: 'Select a service branch',
      labels: ARMY_BRANCH_LABELS,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3ServiceBranchDefault: serviceBranchSchema(),
      wcv3ServiceBranchCustom: serviceBranchSchema(
        Object.keys(ARMY_BRANCH_LABELS),
      ),
    },
  },
};
