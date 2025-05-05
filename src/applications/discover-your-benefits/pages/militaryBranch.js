import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  militaryBranchTypes,
  militaryBranchTypeLabels,
  militaryBranchComponentTypes,
  militaryBranchComponentTypeLabels,
} from '../constants/benefits';

const allBranches = Object.keys(militaryBranchTypes);
const allBranchComponentKeys = Object.values(militaryBranchComponentTypes);

const branchComponentsSchemaProps = allBranches.reduce((acc, branchKey) => {
  acc[branchKey] = checkboxGroupSchema(allBranchComponentKeys);
  return acc;
}, {});

const branchComponentsUIProps = allBranches.reduce((acc, branchKey) => {
  acc[branchKey] = checkboxGroupUI({
    enableAnalytics: true,
    title: `Which component of ${militaryBranchTypeLabels[branchKey]} did you serve in?`,
    labels: militaryBranchComponentTypeLabels,
    required: () => false,
    hideIf: formData => {
      return !formData.militaryBranch?.[branchKey];
    },
  });
  return acc;
}, {});

/** @type {PageSchema} */
export default {
  uiSchema: {
    militaryBranch: checkboxGroupUI({
      enableAnalytics: true,
      title: 'What branch(es) of the military did you serve in?',
      hint: 'Check all that apply.',
      required: () => false,
      labels: militaryBranchTypeLabels,
    }),
    branchComponents: {
      ...branchComponentsUIProps,
    },
  },

  schema: {
    type: 'object',
    properties: {
      militaryBranch: checkboxGroupSchema(allBranches),
      branchComponents: {
        type: 'object',
        properties: branchComponentsSchemaProps,
      },
    },
  },
};
