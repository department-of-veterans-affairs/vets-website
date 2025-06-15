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
const branchesWithComponents = allBranches.filter(
  branchKey => branchKey !== militaryBranchTypes.SPACE_FORCE,
);

const branchesWithoutNationalGuard = [
  militaryBranchTypes.COAST_GUARD,
  militaryBranchTypes.MARINE_CORPS,
  militaryBranchTypes.NAVY,
];

const branchComponentsSchemaProps = branchesWithComponents.reduce(
  (acc, branchKey) => {
    if (branchesWithoutNationalGuard.includes(branchKey)) {
      // National Guard is not a component for these branches
      acc[branchKey] = checkboxGroupSchema(
        allBranchComponentKeys.filter(
          key => key !== militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE,
        ),
      );
    } else {
      // National Guard is a component for these branches
      acc[branchKey] = checkboxGroupSchema(allBranchComponentKeys);
    }
    return acc;
  },
  {},
);

const branchComponentsUIProps = branchesWithComponents.reduce(
  (acc, branchKey) => {
    acc[branchKey] = checkboxGroupUI({
      enableAnalytics: true,
      title: `Which component of the ${
        militaryBranchTypeLabels[branchKey]
      } did you serve in?`,
      hint: 'Select all that apply.',
      labels: militaryBranchComponentTypeLabels,
      required: () => false,
      hideIf: formData => {
        return !formData.militaryBranch?.[branchKey];
      },
    });
    return acc;
  },
  {},
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    militaryBranch: checkboxGroupUI({
      enableAnalytics: true,
      title: 'What branch(es) of the military did you serve in?',
      hint: 'Select all that apply.',
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
