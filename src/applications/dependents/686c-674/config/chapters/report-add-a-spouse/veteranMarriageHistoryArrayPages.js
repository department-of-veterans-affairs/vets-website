import {
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
import { getFullName } from '../../../../shared/utils';

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
  minItems: 0,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.startDate ||
    !item?.endDate ||
    !item?.reasonMarriageEnded ||
    (item.reasonMarriageEnded === 'Other' && !item.otherReasonMarriageEnded) ||
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
    summaryTitle: 'Review your marital history',
    getItemName: item => getFullName(item.fullName),
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
    required: ['fullName'],
    properties: {
      fullName: fullNameNoSuffixSchema,
    },
  },
};

/** @returns {PageSchema} */
export const vetFormerMarriageEndReasonPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Your former marriage end details';
    }),
    reasonMarriageEnded: {
      ...radioUI({
        title: 'How did your marriage end?',
        labels: veteranFormerMarriageLabels,
      }),
    },
    otherReasonMarriageEnded: {
      'ui:title': 'Briefly describe how your marriage ended',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Other',
        expandedContentFocus: true,
        preserveHiddenData: true,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.otherReasonMarriageEnded['ui:collapsed']) {
          return { ...formSchema, required: ['reasonMarriageEnded'] };
        }
        return {
          ...formSchema,
          required: ['reasonMarriageEnded', 'otherReasonMarriageEnded'],
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['reasonMarriageEnded'],
    properties: {
      reasonMarriageEnded: radioSchema(marriageEnums),
      otherReasonMarriageEnded: {
        type: 'string',
      },
    },
  },
};

/** @returns {PageSchema} */
export const vetFormerMarriageStartDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Date your former marriage started';
    }),
    startDate: currentOrPastDateUI({
      title: 'When did you get married?',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['startDate'],
    properties: {
      startDate: currentOrPastDateSchema,
    },
  },
};

export const vetFormerMarriageEndDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Date your former marriage ended';
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
    required: ['endDate'],
    properties: {
      endDate: currentOrPastDateSchema,
    },
  },
};

export const vetFormerMarriageStartLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Location your former marriage started',
    ),
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
            required: 'Enter the city where you were previously married',
          },
          'ui:webComponentField': VaTextInputField,
          'ui:validations': [
            (errors, city) => {
              if (city?.length > 30) {
                errors.addError('City must be 30 characters or less');
              }
            },
          ],
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
    required: ['startLocation'],
    properties: {
      startLocation: customLocationSchema,
    },
  },
};

export const vetFormerMarriageEndLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Location your former marriage ended',
    ),
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
          'ui:validations': [
            (errors, city) => {
              if (city?.length > 30) {
                errors.addError('City must be 30 characters or less');
              }
            },
          ],
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
    required: ['endLocation'],
    properties: {
      endLocation: customLocationSchema,
    },
  },
};
