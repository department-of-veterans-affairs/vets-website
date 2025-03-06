import { capitalize } from 'lodash';
import {
  titleUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
  yesNoUI,
  yesNoSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {ArrayBuilderOptions} */
export const removeChildStoppedAttendingSchoolOptions = {
  arrayPath: 'childStoppedAttendingSchool',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.birthDate ||
    !item?.ssn ||
    !item?.dateChildLeftSchool,
  maxItems: 20,
  text: {
    summaryTitle: 'Review your children between ages 18 and 23 who left school',
    getItemName: item =>
      `${capitalize(item.fullName?.first) || ''} ${capitalize(
        item.fullName?.last,
      ) || ''}`,
  },
};

export const removeChildStoppedAttendingSchoolIntroPage = {
  uiSchema: {
    ...titleUI(
      'Your children between ages 18 and 23 who left school',
      'In the next few questions, we’ll ask you about your children between ages 18 and 23 who left school. You must add at least one child.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const removeChildStoppedAttendingSchoolSummaryPage = {
  uiSchema: {
    'view:completedChildStoppedAttendingSchool': arrayBuilderYesNoUI(
      removeChildStoppedAttendingSchoolOptions,
      {
        title:
          'Do you have another child between ages 18 and 23 who left school to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedChildStoppedAttendingSchool': arrayBuilderYesNoSchema,
    },
    required: ['view:completedChildStoppedAttendingSchool'],
  },
};

/** @returns {PageSchema} */
export const childInformationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Remove a child between ages 18 and 23 who left school',
      nounSingular: removeChildStoppedAttendingSchoolOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(),
    ssn: {
      ...ssnUI('Child’s Social Security number'),
      'ui:required': () => true,
    },
    birthDate: {
      ...currentOrPastDateUI('Child’s date of birth'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      ssn: ssnSchema,
      birthDate: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const dateChildLeftSchoolPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Child’s school information',
    ),
    dateChildLeftSchool: {
      ...currentOrPastDateUI('When did this child stop attending school?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      dateChildLeftSchool: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const childIncomeQuestionPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Child’s income'),
    dependentIncome: {
      ...yesNoUI(
        'Did this child earn an income in the last 365 days? Answer this question only if you are adding this dependent to your pension.',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      dependentIncome: yesNoSchema,
    },
  },
};
