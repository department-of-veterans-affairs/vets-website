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
  veteranFormerMarriageLabels,
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
export const veteranMarriageHistoryOptions = {
  arrayPath: 'veteranMarriageHistory',
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
export const veteranMarriageHistorySummaryPage = {
  uiSchema: {
    'view:completedVeteranFormerMarriage': arrayBuilderYesNoUI(
      veteranMarriageHistoryOptions,
      {
        title: 'Do you have any former marriages to add?',
        hint:
          'If yes, you’ll need to add at least one former marriage. You can add up to 20.',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have any other marriages to add?',
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
      'view:completedVeteranFormerMarriage': arrayBuilderYesNoSchema,
    },
    required: ['view:completedVeteranFormerMarriage'],
  },
};

/** @returns {PageSchema} */
export const vetFormerMarriagePersonalInfoPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Your former marriage',
      nounSingular: veteranMarriageHistoryOptions.nounSingular,
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
export const vetFormerMarriageEndReasonPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Your former marriage';
    }),
    reasonMarriageEnded: {
      ...radioUI({
        title: 'How did your marriage end?',
        required: () => true,
        labels: veteranFormerMarriageLabels,
      }),
    },
    reasonMarriageEndedOther: {
      ...textUI('Briefly describe how your marriage ended'),
      'ui:required': (formData, index) => {
        // See above comment
        const isEditMode = formData?.reasonMarriageEnded === 'Other';
        const isAddMode =
          formData?.veteranMarriageHistory?.[index]?.reasonMarriageEnded ===
          'Other';

        return isEditMode || isAddMode;
      },
      'ui:options': {
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Other',
        hideIf: (formData, index) =>
          !(
            formData?.veteranMarriageHistory?.[index]?.reasonMarriageEnded ===
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
export const vetFormerMarriageStartDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Your former marriage';
    }),
    startDate: {
      ...currentOrPastDateUI('When did you get married?'),
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

export const vetFormerMarriageEndDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Your former marriage';
    }),
    endDate: {
      ...currentOrPastDateUI('When did the marriage end?'),
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

export const vetFormerMarriageStartLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Your former marriage'),
    startLocation: {
      'ui:title': 'Where did you get married?',
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
              formData?.veteranMarriageHistory?.[index]?.startLocation
                ?.outsideUsa || formData?.startLocation?.outsideUsa
            ),
          'ui:options': {
            hideIf: (formData, index) =>
              formData?.veteranMarriageHistory?.[index]?.startLocation
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
            formData?.veteranMarriageHistory?.[index]?.startLocation
              ?.outsideUsa || formData?.startLocation?.outsideUsa,
          'ui:options': {
            hideIf: (formData, index) =>
              !(
                formData?.veteranMarriageHistory?.[index]?.startLocation
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

export const vetFormerMarriageEndLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Your former marriage'),
    endLocation: {
      'ui:title': 'Where did the marriage end?',
      'ui:options': {
        labelHeaderLevel: '4',
      },
      'ui:description': generateHelpText(
        'If you got a divorce or an annulment, we want to know where you filed the paperwork. If your former spouse died, we want to know where the death certificate was filed.',
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
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:required': (formData, index) =>
            !(
              formData?.veteranMarriageHistory?.[index]?.endLocation
                ?.outsideUsa || formData?.endLocation?.outsideUsa
            ),
          'ui:options': {
            hideIf: (formData, index) =>
              formData?.veteranMarriageHistory?.[index]?.endLocation
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
            formData?.veteranMarriageHistory?.[index]?.endLocation
              ?.outsideUsa || formData?.endLocation?.outsideUsa,
          'ui:options': {
            hideIf: (formData, index) =>
              !(
                formData?.veteranMarriageHistory?.[index]?.endLocation
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
