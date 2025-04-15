import { capitalize } from 'lodash';
import {
  titleUI,
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
    (item?.startLocation?.outsideUsa === true &&
      !item?.startLocation?.location?.country) ||
    (item?.endLocation?.outsideUsa === false &&
      !item?.endLocation?.location?.state) ||
    (item?.endLocation?.outsideUsa === true &&
      !item?.endLocation?.location?.country),
  maxItems: 20,
  text: {
    summaryTitle: 'Review your spouse’s marital history',
    getItemName: () => 'Spouse’s former marriage',
    cardDescription: item =>
      `${capitalize(item?.fullName?.first) || ''} ${capitalize(
        item?.fullName?.last,
      ) || ''}`,
  },
};

/** @returns {PageSchema} */
export const spouseMarriageHistorySummaryPage = {
  uiSchema: {
    'view:completedSpouseFormerMarriage': arrayBuilderYesNoUI(
      spouseMarriageHistoryOptions,
      {
        title: 'Does your spouse have any former marriages to add?',
        hint:
          'If yes, you’ll need to add at least one former marriage. You can add up to 20.',
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
        const isEditMode = formData?.reasonMarriageEnded === 'Other';
        const isAddMode =
          formData?.spouseMarriageHistory?.[index]?.reasonMarriageEnded ===
          'Other';

        return isEditMode || isAddMode;
      },
      'ui:options': {
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Other',
        preserveHiddenData: true,
        hideIf: (formData, index) =>
          !(
            formData?.spouseMarriageHistory?.[index]?.reasonMarriageEnded ===
              'Other' || formData?.reasonMarriageEnded === 'Other'
          ),
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
      'ui:validations': [
        {
          validator: (errors, _field, formData) => {
            const { startDate, endDate } = formData;

            if (!startDate || !endDate) return;

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
              errors.addError(
                'Marriage end date must be on or after the marriage start date',
              );
            }
          },
        },
      ],
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
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Spouse’s former marriage'),
    startLocation: {
      'ui:title': 'Where did they get married?',
      'ui:options': {
        labelHeaderLevel: '4',
      },
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
            required: 'Enter the city where they were married',
          },
          'ui:webComponentField': VaTextInputField,
        },
        state: {
          'ui:title': 'State',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:required': (formData, index) =>
            !(
              formData?.spouseMarriageHistory?.[index]?.startLocation
                ?.outsideUsa || formData?.startLocation?.outsideUsa
            ),
          'ui:options': {
            hideIf: (formData, index) =>
              formData?.spouseMarriageHistory?.[index]?.startLocation
                ?.outsideUsa || formData?.startLocation?.outsideUsa,
          },
        },
        country: {
          'ui:title': 'Country',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Select a country',
          },
          'ui:required': (formData, index) =>
            formData?.spouseMarriageHistory?.[index]?.startLocation
              ?.outsideUsa || formData?.startLocation?.outsideUsa,
          'ui:options': {
            hideIf: (formData, index) =>
              !(
                formData?.spouseMarriageHistory?.[index]?.startLocation
                  ?.outsideUsa || formData?.startLocation?.outsideUsa
              ),
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
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Spouse’s former marriage'),
    endLocation: {
      ...titleUI({
        title: 'Where did the marriage end?',
        description:
          'If they got a divorce or an annulment, we want to know where they filed the paperwork. If the former spouse died, we want to know where the death certificate was filed.',
      }),
      'ui:options': {
        labelHeaderLevel: '4',
      },
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
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:required': (formData, index) =>
            !(
              formData?.spouseMarriageHistory?.[index]?.endLocation
                ?.outsideUsa || formData?.endLocation?.outsideUsa
            ),
          'ui:options': {
            hideIf: (formData, index) =>
              formData?.spouseMarriageHistory?.[index]?.endLocation
                ?.outsideUsa || formData?.endLocation?.outsideUsa,
          },
        },
        country: {
          'ui:title': 'Country',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Select a country',
          },
          'ui:required': (formData, index) =>
            formData?.spouseMarriageHistory?.[index]?.endLocation?.outsideUsa ||
            formData?.endLocation?.outsideUsa,
          'ui:options': {
            hideIf: (formData, index) =>
              !(
                formData?.spouseMarriageHistory?.[index]?.endLocation
                  ?.outsideUsa || formData?.endLocation?.outsideUsa
              ),
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
