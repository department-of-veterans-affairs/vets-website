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
export const removeMarriedChildOptions = {
  arrayPath: 'childMarriage',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.birthDate ||
    !item?.ssn ||
    !item?.dateMarried,
  maxItems: 20,
  text: {
    summaryTitle: 'Review your children under 18 who got married',
    getItemName: () => 'Child',
    cardDescription: item =>
      `${capitalize(item?.fullName?.first) || ''} ${capitalize(
        item?.fullName?.last,
      ) || ''}`,
  },
};

export const removeMarriedChildIntroPage = {
  uiSchema: {
    ...titleUI(
      'Your children under 18 who got married',
      'In the next few questions, we’ll ask you about your children who have gotten married. You must add at least one child.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const removeMarriedChildSummaryPage = {
  uiSchema: {
    'view:completedMarriedChild': arrayBuilderYesNoUI(
      removeMarriedChildOptions,
      {
        title: 'Do you have another child to add?',
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
      'view:completedMarriedChild': arrayBuilderYesNoSchema,
    },
    required: ['view:completedMarriedChild'],
  },
};

/** @returns {PageSchema} */
export const marriedChildInformationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Remove a child who got married',
      nounSingular: removeMarriedChildOptions.nounSingular,
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
export const dateChildMarriedPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Child’s marriage date'),
    dateMarried: {
      ...currentOrPastDateUI('When did this child get married?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      dateMarried: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const marriedChildIncomeQuestionPage = {
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
