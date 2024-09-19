import format from 'date-fns-tz/format';
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
import { customLocationSchema } from '../../helpers';

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
    !item?.dependentDeathDate,
  maxItems: 5,
  text: {
    getItemName: item =>
      `${item.fullName?.first || ''} ${item.fullName?.last || ''}`,
    cardDescription: item => {
      const birthDate = item?.birthDate
        ? format(new Date(item.birthDate), 'MM/dd/yyyy')
        : 'Unknown';
      const dependentDeathDate = item?.dependentDeathDate
        ? format(new Date(item.dependentDeathDate), 'MM/dd/yyyy')
        : 'Unknown';

      return `${birthDate} - ${dependentDeathDate}`;
    },
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
    'view:completedDependent': arrayBuilderYesNoUI(deceasedDependentOptions, {
      title: 'Do you have another deceased dependent to report?',
      labels: {
        Y: 'Yes, I have another dependent to report',
        N: 'No, I don’t have another dependent to report',
      },
    }),
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
      const fullName = formData?.fullName || {};
      const { first = '', last = '' } = fullName;

      return first && last
        ? `Your relationship to ${first} ${last}`
        : 'Your relationship to the deceased dependent';
    }),
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
      const fullName = formData?.fullName || {};
      const { first = '', last = '' } = fullName;

      return first && last
        ? `Your relationship to ${first} ${last}`
        : 'Your relationship to the deceased dependent';
    }),
    childStatus: {
      ...checkboxGroupUI({
        title: 'What type of child?',
        required: formData => {
          return formData?.dependentType === 'child';
        },
        labels: childTypeLabels,
      }),
      // ...(window.location.search.includes('add=true')
      //   ? { 'ui:required': () => true }
      //   : {}),
      // 'ui:required': () => true,
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
      const fullName = formData?.fullName || {};
      const { first = '', last = '' } = fullName;

      return first && last
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
      const fullName = formData?.fullName || {};
      const { first = '', last = '' } = fullName;

      return first && last
        ? `Where did ${first} ${last} die?`
        : 'Where did the dependent die?';
    }),
    dependentDeathLocation: {
      outsideUsa: {
        'ui:title': 'This occurred outside the U.S.',
        'ui:webComponentField': VaCheckboxField,
      },
      location: {
        city: {
          'ui:title': 'City',
          'ui:required': () => true,
          'ui:autocomplete': 'address-level2',
          'ui:errorMessages': {
            required: 'Enter the city where the dependent died',
          },
          'ui:webComponentField': VaTextInputField,
        },

        state: {
          'ui:title': 'State',
          'ui:webComponentField': VaSelectField,
          'ui:required': itemData =>
            !itemData?.dependentDeathLocation?.outsideUsa,
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:options': {
            hideIf: itemData => itemData?.dependentDeathLocation?.outsideUsa,
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      dependentDeathLocation: customLocationSchema,
    },
  },
};
