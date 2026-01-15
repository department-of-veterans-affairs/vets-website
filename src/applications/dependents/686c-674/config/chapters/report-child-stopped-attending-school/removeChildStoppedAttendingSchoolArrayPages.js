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
    getItemName: item => getFullName(item.fullName),
    cancelAddButtonText: 'Cancel removing this child',
  },
};

export const removeChildStoppedAttendingSchoolIntroPage = {
  uiSchema: {
    ...titleUI('Your children'),
    'ui:description': () => (
      <>
        <p>
          In the next few questions, we’ll ask you about your children between
          ages 18 and 23 who left school. You must add at least one child.
        </p>
        <CancelButton
          dependentType="children who left school"
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
export const removeChildStoppedAttendingSchoolSummaryPage = {
  uiSchema: {
    'view:completedChildStoppedAttendingSchool': arrayBuilderYesNoUI(
      removeChildStoppedAttendingSchoolOptions,
      {
        title:
          'Do you have a child between ages 18 and 23 who left school to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
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
    required: ['dateChildLeftSchool'],
    properties: {
      dateChildLeftSchool: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const childIncomeQuestionPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Child’s income'),
    dependentIncome: radioUI({
      title: 'Did this child have an income in the last 365 days?',
      hint:
        'Answer this question only if you are removing this dependent from your pension.',
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
