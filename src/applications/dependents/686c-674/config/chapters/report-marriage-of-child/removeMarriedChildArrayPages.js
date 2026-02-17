import React from 'react';

import {
  titleUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
  radioUI,
  radioSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CancelButton, incomeQuestionUpdateUiSchema } from '../../helpers';
import { getFullName } from '../../../../shared/utils';

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
    getItemName: item => getFullName(item.fullName),
    cancelAddButtonText: 'Cancel removing this child',
  },
};

export const removeMarriedChildIntroPage = {
  uiSchema: {
    ...titleUI('Your children under 18 who got married'),
    'ui:description': () => (
      <>
        <p>
          In the next few questions, we’ll ask you about your children who have
          gotten married. You must add at least one child.
        </p>
        <CancelButton
          dependentType="children who got married"
          dependentButtonType="children"
          isAddChapter={false}
        />
      </>
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
        title: 'Do you have a child to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
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
    birthDate: currentOrPastDateUI({
      title: 'Child’s date of birth',
      dataDogHidden: true,
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['fullName', 'ssn', 'birthDate'],
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
    required: ['dateMarried'],
    properties: {
      dateMarried: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const marriedChildIncomeQuestionPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Child’s income'),
    dependentIncome: radioUI({
      title: 'Did this child have an income in the last 365 days?',
      hint: 'Answer this question only if you are removing this dependent from your pension.',
      labels: {
        Y: 'Yes',
        N: 'No',
        NA: 'This question doesn’t apply to me',
      },
      required: (_chapterData, _index, formData) =>
        formData?.vaDependentsNetWorthAndPension,
      updateUiSchema: incomeQuestionUpdateUiSchema,
      updateSchema: (formData = {}, formSchema) => {
        const { vaDependentsNetWorthAndPension } = formData;

        if (!vaDependentsNetWorthAndPension) {
          return formSchema;
        }

        return {
          ...radioSchema(['Y', 'N']),
        };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      dependentIncome: radioSchema(['Y', 'N', 'NA']),
    },
  },
};
