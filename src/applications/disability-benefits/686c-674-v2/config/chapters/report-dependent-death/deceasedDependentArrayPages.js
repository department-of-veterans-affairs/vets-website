import {
  // addressNoMilitarySchema,
  // addressNoMilitaryUI,
  // currentOrPastDateRangeSchema,
  // currentOrPastDateRangeUI,
  addressUI,
  addressSchema,
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
} from 'platform/forms-system/src/js/web-component-patterns';
// import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  relationshipEnums,
  relationshipLabels,
  childTypeEnums,
  childTypeLabels,
  // DependentRelationshipH3,
} from './dependent-additional-information/helpers';

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
    !item?.birthDate,
  // !item?.dependentType ||
  // !item?.childStatus ||
  // !item?.date,
  maxItems: 5,
  text: {
    getItemName: item => `${item.fullName.first} ${item.fullName.last}`,
    cardDescription: item => `${item?.birthDate} - ${item?.date}`,
  },
};

/** @returns {PageSchema} */
export const deceasedDependentIntroPage = {
  uiSchema: {
    ...titleUI({
      title: 'Dependents who have died',
      description:
        'In the next few questions, we’ll ask you about your dependents who have died. You must add at least one dependent. You may add up to 5 dependents.',
    }),
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
      // {
      //   title:
      //     'Do you have any employment, including self-employment for the last 5 years to report?',
      //   hint:
      //     'Include self-employment and military duty (including inactive duty for training).',
      //   labels: {
      //     Y: 'Yes, I have employment to report',
      //     N: 'No, I don’t have employment to report',
      //   },
      // },
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
      title: 'Dependent who has died',
      nounSingular: deceasedDependentOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(),
    ssn: {
      ...ssnUI('Dependent’s Social Security number'),
      'ui:required': () => true,
    },
    birthDate: currentOrPastDateUI({
      title: 'Dependent’s date of birth',
      required: () => true,
    }),
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
export const deceasedDependentChildStatusPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
      // console.log(formData);
      const { first, last } = formData?.fullName;
      return formData?.fullName
        ? `Your relationship to ${first} ${last}`
        : 'Your relationship to the deceased dependent';
    }),
    // 'ui:title': DependentRelationshipH3,
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
    properties: {
      dependentType: radioSchema(relationshipEnums),
    },
  },
};

/** @returns {PageSchema} */
export const deceasedDependentChildTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
      // console.log(formData);
      const { first, last } = formData?.fullName;
      return formData?.fullName
        ? `Your relationship to ${first} ${last}`
        : 'Your relationship to the deceased dependent';
    }),
    childStatus: {
      ...checkboxGroupUI({
        title: 'What type of child?',
        required: formData => formData?.dependentType === 'child',
        labels: childTypeLabels,
      }),
      // 'ui:required': (formData, index) =>
      //   formData?.deaths[index]?.dependentType === 'child',
    },
  },
  schema: {
    type: 'object',
    properties: {
      childStatus: checkboxGroupSchema(childTypeEnums),
    },
  },
};

export const deceasedDependentDateOfDeathPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
      // console.log(formData);
      const { first, last } = formData?.fullName;
      return formData?.fullName
        ? `When did ${first} ${last} die?`
        : 'When did the dependent die?';
    }),
    dependentDeathDate: currentOrPastDateUI({
      title: 'Date of death',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      dependentDeathDate: currentOrPastDateSchema,
    },
  },
};

export const deceasedDependentLocationOfDeathPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
      // console.log(formData);
      const { first, last } = formData?.fullName;
      return formData?.fullName
        ? `Where did ${first} ${last} die?`
        : 'Where did the dependent die?';
    }),
    dependentDeathLocation: addressUI({
      labels: {
        militaryCheckbox: 'This occurred outside of the U.S.',
      },
      omit: ['street', 'street2', 'street3', 'country', 'postalCode'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      dependentDeathLocation: addressSchema({
        omit: ['street', 'street2', 'street3', 'country', 'postalCode'],
      }),
    },
  },
};
