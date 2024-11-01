import { format, parseISO } from 'date-fns';
import { capitalize } from 'lodash';
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
    !item?.dependentDeathDate ||
    (item?.dependentDeathLocation?.outsideUsa === false &&
      !item?.dependentDeathLocation?.location?.state),
  maxItems: 7,
  text: {
    getItemName: item =>
      `${capitalize(item.fullName?.first) || ''} ${capitalize(
        item.fullName?.last,
      ) || ''}`,
    cardDescription: item => {
      const birthDate = item?.birthDate
        ? format(parseISO(item.birthDate), 'MM/dd/yyyy')
        : 'Unknown';
      const dependentDeathDate = item?.dependentDeathDate
        ? format(parseISO(item.dependentDeathDate), 'MM/dd/yyyy')
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
        'In the next few questions, we’ll ask you about your dependents who have died. You must add at least one dependent. You may add up to 7 dependents.',
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
export const deceasedDependentTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
      const fullName = formData?.fullName || {};
      const { first = '', last = '' } = fullName;

      return first && last
        ? `Your relationship to ${capitalize(first)} ${capitalize(last)}`
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
        ? `Your relationship to ${capitalize(first)} ${capitalize(last)}`
        : 'Your relationship to the deceased dependent';
    }),
    childStatus: {
      ...checkboxGroupUI({
        title: 'What type of child?',
        required: () => true,
        labels: childTypeLabels,
      }),
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
        ? `When did ${capitalize(first)} ${capitalize(last)} die?`
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
        ? `Where did ${capitalize(first)} ${capitalize(last)} die?`
        : 'Where did the dependent die?';
    }),
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
          'ui:required': (formData, index) => {
            const isEditMode = formData?.dependentDeathLocation?.outsideUsa;
            const isAddMode =
              formData?.deaths?.[index]?.dependentDeathLocation?.outsideUsa;

            return !isAddMode && !isEditMode;
          },
          'ui:options': {
            // NOTE: formData while in Add mode of the array builder
            // will be the entire formData object
            // formData while in Edit mode will be the entire array item object
            // Because of this, index will sometimes be null
            // Check for both to cover both array builder modes
            hideIf: (formData, index) =>
              formData?.dependentDeathLocation?.outsideUsa ||
              formData?.deaths?.[index]?.dependentDeathLocation?.outsideUsa,
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
