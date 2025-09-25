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

const branchComponentUrlNames = {
  AIR_FORCE: 'air-force',
  ARMY: 'army',
  COAST_GUARD: 'coast-guard',
  MARINE_CORPS: 'marine-corps',
  NAVY: 'navy',
  SPACE_FORCE: 'space-force',
};

const branchComponentsSchemaProps = branchKey => {
  if (branchesWithoutNationalGuard.includes(branchKey)) {
    // National Guard is not a component for these branches
    return checkboxGroupSchema(
      allBranchComponentKeys.filter(
        key => key !== militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE,
      ),
    );
  }
  // National Guard is a component for these branches
  return checkboxGroupSchema(allBranchComponentKeys);
};

const branchComponentsUIProps = branchKey => {
  return checkboxGroupUI({
    enableAnalytics: true,
    title: `Which component(s) of the ${
      militaryBranchTypeLabels[branchKey]
    } did you serve in?`,
    hint: 'Select all that apply.',
    labels: militaryBranchComponentTypeLabels,
    required: () => false,
  });
};

const getBranchComponentPage = branchKey => {
  return {
    path: `service/${branchComponentUrlNames[branchKey]}`,
    title: `${militaryBranchTypeLabels[branchKey]}`,
    uiSchema: {
      [branchKey]: {
        ...branchComponentsUIProps(branchKey),
      },
    },
    schema: {
      type: 'object',
      properties: {
        [branchKey]: branchComponentsSchemaProps(branchKey),
      },
    },
    depends: formData => formData.militaryBranch?.[branchKey],
  };
};

export const getBranchComponentPages = () => {
  const branchComponentPages = {};
  branchesWithComponents.forEach(branchKey => {
    branchComponentPages[branchKey] = getBranchComponentPage(branchKey);
  });
  return branchComponentPages;
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    militaryBranch: checkboxGroupUI({
      enableAnalytics: true,
      title: 'Which branch(es) of the military did you serve in?',
      hint: 'Select all that apply.',
      required: () => false,
      labels: militaryBranchTypeLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      militaryBranch: checkboxGroupSchema(allBranches),
    },
  },
};
