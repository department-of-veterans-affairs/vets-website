import React from 'react';

import {
  titleUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  dateOfDeathUI,
  dateOfDeathSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

import {
  relationshipEnums,
  relationshipLabels,
  childTypeEnums,
  childTypeLabels,
} from './helpers';
import {
  customLocationSchema,
  generateHelpText,
  CancelButton,
  incomeQuestionUpdateUiSchema,
} from '../../helpers';
import { getFullName } from '../../../../shared/utils';

/** @type {ArrayBuilderOptions} */
export const deceasedDependentOptions = {
  arrayPath: 'deaths',
  nounSingular: 'dependent',
  nounPlural: 'dependents',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.ssn ||
    !item?.birthDate ||
    !item?.dependentType ||
    !item?.dependentDeathLocation?.location?.city ||
    !item?.dependentDeathDate ||
    (item?.dependentDeathLocation?.outsideUsa === false &&
      !item?.dependentDeathLocation?.location?.state) ||
    (item?.dependentDeathLocation?.outsideUsa === true &&
      !item?.dependentDeathLocation?.location?.country),
  maxItems: 20,
  text: {
    getItemName: item => getFullName(item.fullName),
    cardDescription: item => {
      const dependentType = item?.dependentType;

      if (!dependentType) {
        return 'Dependent';
      }

      const label = relationshipLabels[dependentType];

      if (label) {
        return label;
      }

      return 'Dependent';
    },
    summaryTitle: 'Review your dependents who have died',
    cancelAddButtonText: 'Cancel removing this dependent',
  },
};

/** @returns {PageSchema} */
export const deceasedDependentIntroPage = {
  uiSchema: {
    ...titleUI('Your dependents who have died'),
    'ui:description': () => (
      <>
        <p>
          In the next few questions, we’ll ask you about your dependents who
          have died. You must add at least one dependent who has died.
        </p>
        <CancelButton
          dependentType="dependents who have died"
          dependentButtonType="dependents"
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
export const deceasedDependentSummaryPage = {
  uiSchema: {
    'view:completedDependent': arrayBuilderYesNoUI(
      deceasedDependentOptions,
      {
        title: 'Do you have a deceased dependent to report?',
        labels: {
          Y: 'Yes, I have a dependent to report',
          N: 'No, I don’t have a dependent to report',
        },
      },
      {
        title: 'Do you have another deceased dependent to report?',
        labels: {
          Y: 'Yes, I have another dependent to report',
          N: 'No, I don’t have another dependent to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedDependent': arrayBuilderYesNoSchema,
    },
    required: ['view:completedDependent'],
  },
};

/** @returns {PageSchema} */
export const deceasedDependentPersonalInfoPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Remove a dependent who has died',
      nounSingular: deceasedDependentOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(),
    ssn: {
      ...ssnUI('Dependent’s Social Security number'),
      'ui:required': () => true,
    },
    birthDate: currentOrPastDateUI({
      title: 'Dependent’s date of birth',
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
export const deceasedDependentTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Your relationship to this dependent',
    ),
    dependentType: {
      ...radioUI({
        title: 'What was your relationship to the dependent?',
        required: () => true,
        labels: relationshipLabels,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['dependentType'],
    properties: {
      dependentType: radioSchema(relationshipEnums),
    },
  },
};

/** @returns {PageSchema} */
export const deceasedDependentChildTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Type of child dependent'),
    childStatus: {
      ...checkboxGroupUI({
        title: 'What type of child?',
        labels: childTypeLabels,
        required: () => true,
      }),
      'ui:description': generateHelpText('Check all that apply'),
      'ui:options': {
        updateSchema: (formData, schema, _uiSchema, index) => {
          const itemData = formData?.deaths?.[index];

          if (itemData?.dependentType !== 'CHILD' && itemData?.childStatus) {
            Object.keys(itemData.childStatus).forEach(key => {
              itemData.childStatus[key] = undefined;
            });
          }

          return schema;
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['childStatus'],
    properties: {
      childStatus: checkboxGroupSchema(childTypeEnums),
    },
  },
};

export const deceasedDependentDateOfDeathPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'When did this dependent die?',
    ),
    dependentDeathDate: dateOfDeathUI({
      title: 'Date of death',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['dependentDeathDate'],
    properties: {
      dependentDeathDate: dateOfDeathSchema,
    },
  },
};

export const deceasedDependentLocationOfDeathPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Where did this dependent die?',
    ),
    dependentDeathLocation: {
      outsideUsa: {
        'ui:title': 'This occurred outside the U.S.',
        'ui:webComponentField': VaCheckboxField,
      },
      location: {
        city: {
          'ui:title': 'Enter a city',
          'ui:webComponentField': VaTextInputField,
          'ui:required': () => true,
          'ui:errorMessages': {
            required: 'Enter a city',
          },
        },
        state: {
          'ui:title': 'Select a state',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Enter a state',
          },
          'ui:required': (formData, index) =>
            !(
              formData?.deaths?.[index]?.dependentDeathLocation?.outsideUsa ||
              formData?.dependentDeathLocation?.outsideUsa
            ),
          'ui:options': {
            hideIf: (formData, index) =>
              formData?.deaths?.[index]?.dependentDeathLocation?.outsideUsa ||
              formData?.dependentDeathLocation?.outsideUsa,
          },
        },
        country: {
          'ui:title': 'Select a country',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Select a country',
          },
          'ui:required': (formData, index) =>
            formData?.deaths?.[index]?.dependentDeathLocation?.outsideUsa ||
            formData?.dependentDeathLocation?.outsideUsa,
          'ui:options': {
            hideIf: (formData, index) =>
              !(
                formData?.deaths?.[index]?.dependentDeathLocation?.outsideUsa ||
                formData?.dependentDeathLocation?.outsideUsa
              ),
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['dependentDeathLocation'],
    properties: {
      dependentDeathLocation: customLocationSchema,
    },
  },
};

export const deceasedDependentIncomePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Dependent’s income'),
    deceasedDependentIncome: radioUI({
      title: 'Did this dependent have an income in the last 365 days?',
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
      deceasedDependentIncome: radioSchema(['Y', 'N', 'NA']),
    },
  },
};
