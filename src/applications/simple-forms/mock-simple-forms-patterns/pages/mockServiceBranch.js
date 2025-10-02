import {
  serviceBranchUI,
  serviceBranchSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3ServiceBranchDefault: serviceBranchUI({
      title: 'Service branch default',
      hint: 'Choose from among the default service branches',
      placeholder: 'Select a service branch',
      required: () => true,
    }),
    wcv3ServiceBranchCustom: serviceBranchUI({
      title: 'Service branch custom options',
      required: () => true,
      hint: 'Choose from a custom list of service branches',
      placeholder: 'Select a service branch',
    }),
    wcv3ServiceBranchWithOptGroups: serviceBranchUI({
      title: 'Service branch with opt groups',
      required: () => true,
      hint: 'Choose from a custom list of service branches with option groups',
      placeholder: 'Select a service branch',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3ServiceBranchDefault: serviceBranchSchema(),
      wcv3ServiceBranchCustom: serviceBranchSchema({
        branches: [
          { value: 'AF', label: 'Air Force' },
          { value: 'ARMY', label: 'Army' },
          { value: 'MC', label: 'Marine Corps' },
          { value: 'NAVY', label: 'Navy' },
          { value: 'SF', label: 'Space Force' },
        ],
      }),
      wcv3ServiceBranchWithOptGroups: serviceBranchSchema({
        branches: [
          {
            optionGroup: 'Active Duty',
            options: [
              { value: 'AF', label: 'Air Force' },
              { value: 'ARMY', label: 'Army' },
              { value: 'MC', label: 'Marine Corps' },
              { value: 'NAVY', label: 'Navy' },
              { value: 'SF', label: 'Space Force' },
            ],
          },
          {
            optionGroup: 'National Guard',
            options: [
              { value: 'ANG', label: 'Air National Guard' },
              { value: 'ARNG', label: 'Army National Guard' },
            ],
          },
        ],
      }),
    },
  },
};
