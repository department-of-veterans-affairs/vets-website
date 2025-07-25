import React from 'react';

import {
  titleUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
  yesNoUI,
  yesNoSchema,
  addressUI,
  addressSchema,
  radioUI,
  radioSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CancelButton } from '../../helpers';
import { getFullName } from '../../../../shared/utils';

/** @type {ArrayBuilderOptions} */
export const removeChildHouseholdOptions = {
  arrayPath: 'stepChildren',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.birthDate ||
    !item?.ssn ||
    (item?.supportingStepchild && !item?.livingExpensesPaid) ||
    !item?.whoDoesTheStepchildLiveWith?.first ||
    !item?.whoDoesTheStepchildLiveWith?.last ||
    !item?.address?.country ||
    !item?.address?.street ||
    !item?.address?.city ||
    !item?.address?.state ||
    !item?.address?.postalCode,
  maxItems: 20,
  text: {
    summaryTitle: 'Review your stepchildren who have left your household',
    getItemName: item => getFullName(item.fullName),
    cancelAddButtonText: 'Cancel removing this child',
  },
};

export const removeChildHouseholdIntroPage = {
  uiSchema: {
    ...titleUI('Your stepchildren who have left your household'),
    'ui:description': () => (
      <>
        <p>
          In the next few questions, we’ll ask you about your stepchildren. You
          must add at least one stepchild.
        </p>
        <CancelButton dependentType="stepchildren" isAddChapter={false} />
      </>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const removeChildHouseholdSummaryPage = {
  uiSchema: {
    'view:completedHouseholdChild': arrayBuilderYesNoUI(
      removeChildHouseholdOptions,
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
      'view:completedHouseholdChild': arrayBuilderYesNoSchema,
    },
    required: ['view:completedHouseholdChild'],
  },
};

/** @returns {PageSchema} */
export const householdChildInfoPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Remove a stepchild who has left your household',
      nounSingular: removeChildHouseholdOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(title => `Child’s ${title}`),
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
export const veteranSupportsChildPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Your support of this stepchild',
    ),
    supportingStepchild: {
      ...yesNoUI('Are you still supporting this stepchild?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    required: ['supportingStepchild'],
    properties: {
      supportingStepchild: yesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
export const supportAmountPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Your support of this stepchild',
    ),
    livingExpensesPaid: {
      ...radioUI({
        title: 'How much of this stepchild’s living expenses do you pay?',
        labels: {
          'More than half': 'More than half',
          Half: 'Half',
          'Less than half': 'Less than half',
        },
      }),
      'ui:options': {
        updateSchema: (formData, schema, _uiSchema, index) => {
          const itemData = formData?.stepChildren?.[index];

          if (itemData?.supportingStepchild === false) {
            itemData.livingExpensesPaid = undefined;
            return schema;
          }

          return schema;
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['livingExpensesPaid'],
    properties: {
      livingExpensesPaid: radioSchema([
        'More than half',
        'Half',
        'Less than half',
      ]),
    },
  },
};

/** @returns {PageSchema} */
export const childAddressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Stepchild’s address'),
    address: {
      ...addressUI({
        labels: {
          militaryCheckbox:
            'This child lives on a United States military base outside of the U.S.',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
    required: ['address'],
  },
};

/** @returns {PageSchema} */
export const parentOrGuardianPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Who does this stepchild live with?',
    ),
    whoDoesTheStepchildLiveWith: {
      ...fullNameNoSuffixUI(title => `Parent or guardian’s ${title}`),
    },
  },
  schema: {
    type: 'object',
    properties: {
      whoDoesTheStepchildLiveWith: fullNameNoSuffixSchema,
    },
    required: ['whoDoesTheStepchildLiveWith'],
  },
};
