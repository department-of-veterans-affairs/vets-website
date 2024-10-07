import { format, parseISO } from 'date-fns';
import { capitalize } from 'lodash';
import {
  textUI,
  textSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  marriageEnums,
  spouseFormerMarriageLabels,
  customLocationSchema,
  generateHelpText,
} from '../../helpers';

/* NOTE: 
 * In "Add mode" of the array builder, formData represents the entire formData object.
 * In "Edit mode," formData represents the specific array item being edited.
 * As a result, the index param may sometimes come back null depending on which mode the user is in.
 * To handle both modes, ensure that you check both via RJSF like these pages do.
 */

/** @type {ArrayBuilderOptions} */
export const spouseMarriageHistoryOptions = {
  arrayPath: 'spouseMarriageHistory',
  nounSingular: 'spouse',
  nounPlural: 'spouses',
  required: false,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.startDate ||
    !item?.endDate ||
    !item?.reasonMarriageEnded ||
    !item?.startLocation?.location?.city ||
    !item?.endLocation?.location?.city ||
    (item?.startLocation?.outsideUsa === false &&
      !item?.startLocation?.location?.state) ||
    (item?.endLocation?.outsideUsa === false &&
      !item?.endLocation?.location?.state),
  maxItems: 7,
  text: {
    getItemName: item =>
      `${capitalize(item.fullName?.first) || ''} ${capitalize(
        item.fullName?.last,
      ) || ''}`,
    cardDescription: item => {
      const start = item?.startDate
        ? format(parseISO(item.startDate), 'MM/dd/yyyy')
        : 'Unknown';
      const end = item?.endDate
        ? format(parseISO(item.endDate), 'MM/dd/yyyy')
        : 'Unknown';

      return `${start} - ${end}`;
    },
  },
};

/** @returns {PageSchema} */
export const spouseMarriageHistorySummaryPage = {
  uiSchema: {
    'view:completedSpouseFormerMarriage': arrayBuilderYesNoUI(
      spouseMarriageHistoryOptions,
      {
        title: 'Does your spouse have any previous marriages to report?',
        labels: {
          Y: 'Yes, they have another marriage to report',
          N: 'No, they don’t have another marriage to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedSpouseFormerMarriage': arrayBuilderYesNoSchema,
    },
    required: ['view:completedSpouseFormerMarriage'],
  },
};

/** @returns {PageSchema} */
export const formerMarriagePersonalInfoPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Spouse’s former marriage',
      nounSingular: spouseMarriageHistoryOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
    },
  },
};

/** @returns {PageSchema} */
export const formerMarriageEndReasonPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Spouse’s former marriage';
    }),
    reasonMarriageEnded: {
      ...radioUI({
        title: 'How did their marriage end?',
        required: () => true,
        labels: spouseFormerMarriageLabels,
      }),
    },
    reasonMarriageEndedOther: {
      ...textUI('Briefly describe how their marriage ended'),
      'ui:required': (formData, index) => {
        // See above comment
        const isEditMode = formData?.reasonMarriageEnded === 'Other';
        const isAddMode =
          formData?.spouseMarriageHistory?.[index]?.reasonMarriageEnded ===
          'Other';

        return isEditMode || isAddMode;
      },
      'ui:options': {
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Other',
        keepInPageOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      reasonMarriageEnded: radioSchema(marriageEnums),
      reasonMarriageEndedOther: textSchema,
    },
  },
};

/** @returns {PageSchema} */
export const formerMarriageStartDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Spouse’s former marriage';
    }),
    startDate: {
      ...currentOrPastDateUI('When did they get married?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      startDate: currentOrPastDateSchema,
    },
  },
};

export const formerMarriageEndDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Spouse’s former marriage';
    }),
    endDate: {
      ...currentOrPastDateUI('When did their marriage end?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      endDate: currentOrPastDateSchema,
    },
  },
};

export const formerMarriageStartLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Spouse’s former marriage';
    }),
    startLocation: {
      'ui:title': 'Where did they get married?',
      'ui:options': {
        labelHeaderLevel: '4',
      },
      outsideUsa: {
        'ui:title': 'They got married outside the U.S.',
        'ui:webComponentField': VaCheckboxField,
      },
      location: {
        city: {
          'ui:title': 'City',
          'ui:required': () => true,
          'ui:autocomplete': 'address-level2',
          'ui:errorMessages': {
            required: 'Enter the city where they were married',
          },
          'ui:webComponentField': VaTextInputField,
        },
        state: {
          'ui:title': 'State',
          'ui:webComponentField': VaSelectField,
          'ui:required': (formData, index) => {
            // See above comment
            const isEditMode = formData?.startLocation?.outsideUsa;
            const isAddMode =
              formData?.spouseMarriageHistory?.[index]?.startLocation
                ?.outsideUsa;

            return !isAddMode && !isEditMode;
          },
          'ui:options': {
            hideIf: (formData, index) =>
              // See above comment
              formData?.startLocation?.outsideUsa ||
              formData?.spouseMarriageHistory?.[index]?.startLocation
                ?.outsideUsa,
          },
          'ui:errorMessages': {
            required: 'Select a state',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      startLocation: customLocationSchema,
    },
  },
};

export const formerMarriageEndLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Spouse’s former marriage';
    }),
    endLocation: {
      'ui:title': 'Where did the marriage end?',
      'ui:options': {
        labelHeaderLevel: '4',
      },
      'ui:description': generateHelpText(
        'If they got a divorce or an annulment, we want to know where they filed the paperwork. If the former spouse died, we want to know where the death certificate was filed.',
      ),
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
            required: 'Enter the city where this occurred',
          },
          'ui:webComponentField': VaTextInputField,
        },
        state: {
          'ui:title': 'State',
          'ui:webComponentField': VaSelectField,
          'ui:required': (formData, index) => {
            // See above comment
            const isEditMode = formData?.endLocation?.outsideUsa;
            const isAddMode =
              formData?.spouseMarriageHistory?.[index]?.endLocation?.outsideUsa;

            return !isAddMode && !isEditMode;
          },
          'ui:options': {
            hideIf: (formData, index) =>
              // See above comment
              formData?.endLocation?.outsideUsa ||
              formData?.spouseMarriageHistory?.[index]?.endLocation?.outsideUsa,
          },
          'ui:errorMessages': {
            required: 'Select a state',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      endLocation: customLocationSchema,
    },
  },
};
// export const deceasedDependentTypePage = {
//   uiSchema: {
//     ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
//       const fullName = formData?.fullName || {};
//       const { first = '', last = '' } = fullName;

//       return first && last
//         ? `Your relationship to ${capitalize(first)} ${capitalize(last)}`
//         : 'Your relationship to the deceased dependent';
//     }),
//     dependentType: {
//       ...radioUI({
//         title: 'What was your relationship to the dependent?',
//         required: () => true,
//         labels: relationshipLabels,
//       }),
//     },
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       dependentType: radioSchema(relationshipEnums),
//     },
//   },
// };

// /** @returns {PageSchema} */
// export const deceasedDependentChildTypePage = {
//   uiSchema: {
//     ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
//       const fullName = formData?.fullName || {};
//       const { first = '', last = '' } = fullName;

//       return first && last
//         ? `Your relationship to ${capitalize(first)} ${capitalize(last)}`
//         : 'Your relationship to the deceased dependent';
//     }),
//     childStatus: {
//       ...checkboxGroupUI({
//         title: 'What type of child?',
//         required: () => true,
//         labels: childTypeLabels,
//       }),
//     },
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       childStatus: checkboxGroupSchema(childTypeEnums),
//     },
//   },
// };

// export const deceasedDependentDateOfDeathPage = {
//   uiSchema: {
//     ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
//       const fullName = formData?.fullName || {};
//       const { first = '', last = '' } = fullName;

//       return first && last
//         ? `When did ${capitalize(first)} ${capitalize(last)} die?`
//         : 'When did the dependent die?';
//     }),
//     dependentDeathDate: currentOrPastDateUI({
//       title: 'Date of death',
//       required: () => true,
//     }),
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       dependentDeathDate: currentOrPastDateSchema,
//     },
//   },
// };

// export const deceasedDependentLocationOfDeathPage = {
//   uiSchema: {
//     ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
//       const fullName = formData?.fullName || {};
//       const { first = '', last = '' } = fullName;

//       return first && last
//         ? `Where did ${capitalize(first)} ${capitalize(last)} die?`
//         : 'Where did the dependent die?';
//     }),
//     dependentDeathLocation: {
//       outsideUsa: {
//         'ui:title': 'This occurred outside the U.S.',
//         'ui:webComponentField': VaCheckboxField,
//       },
//       location: {
//         city: {
//           'ui:title': 'Enter a city',
//           'ui:webComponentField': VaTextInputField,
//           'ui:required': () => true,
//           'ui:errorMessages': {
//             required: 'Enter a city',
//           },
//         },
//         state: {
//           'ui:title': 'Select a state',
//           'ui:webComponentField': VaSelectField,
//           'ui:errorMessages': {
//             required: 'Enter a state',
//           },
//           'ui:required': (formData, index) => {
//             const isEditMode = formData?.dependentDeathLocation?.outsideUsa;
//             const isAddMode =
//               formData?.deaths?.[index]?.dependentDeathLocation?.outsideUsa;

//             return !isAddMode && !isEditMode;
//           },
//           'ui:options': {
//             // NOTE: formData while in Add mode of the array builder
//             // will be the entire formData object
//             // formData while in Edit mode will be the entire array item object
//             // Because of this, index will sometimes be null
//             // Check for both to cover both array builder modes
//             hideIf: (formData, index) =>
//               formData?.dependentDeathLocation?.outsideUsa ||
//               formData?.deaths?.[index]?.dependentDeathLocation?.outsideUsa,
//           },
//         },
//       },
//     },
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       dependentDeathLocation: customLocationSchema,
//     },
//   },
// };
