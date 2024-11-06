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
  nounSingular: 'former marriage',
  nounPlural: 'former marriages',
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
    summaryTitle: 'Review your spouse’s former marriages',
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
        title: 'Does your spouse have any former marriages to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Does your spouse have any other marriages to add?',
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
