import React from 'react';
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
  spouseFormerMarriageLabels,
  customLocationSchema,
} from '../../helpers';
import { getFullName } from '../../../../shared/utils';

/** @type {ArrayBuilderOptions} */
export const spouseMarriageHistoryOptions = {
  arrayPath: 'spouseMarriageHistory',
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
    summaryTitle: 'Review your spouse’s marital history',
    summaryTitleWithoutItems: 'Spouse’s former marriages',
    getItemName: item => getFullName(item.fullName),
  },
};

/** @returns {PageSchema} */
export const spouseMarriageHistorySummaryPage = {
  uiSchema: {
    'view:completedSpouseFormerMarriage': {
      ...arrayBuilderYesNoUI(spouseMarriageHistoryOptions, {
        title: 'Has your spouse been married before?',
        hint:
          'If yes, you’ll need to add at least one former marriage. You can add up to 20.',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        labelHeaderLevel: 4,
      }),
    },
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
      title: 'Name of your spouse’s former spouse',
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
export const formerMarriageEndReasonPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Spouse’s former marriage end details';
    }),
    reasonMarriageEnded: radioUI({
      title: 'How did your spouse’s previous marriage end?',
      labels: spouseFormerMarriageLabels,
    }),
    otherReasonMarriageEnded: {
      'ui:title': 'Briefly describe how your spouse’s previous marriage ended',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Other',
        expandedContentFocus: true,
        preserveHiddenData: true,
      },
    },
    'ui:options': {
      // Use updateSchema to set
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
export const formerMarriageStartDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => {
      return 'Spouse’s former marriage';
    }),
    startDate: {
      ...currentOrPastDateUI('When did your spouse previously get married?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    required: ['startDate'],
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
      ...currentOrPastDateUI('When did your spouse’s former marriage end?'),
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

export const formerMarriageStartLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Spouse’s former marriage'),
    startLocation: {
      'ui:description': () => (
        <h4>Where did your spouse previously get married?</h4>
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
            required: 'Enter the city where your spouse was previously married',
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
    required: ['startLocation'],
    properties: {
      startLocation: customLocationSchema,
    },
  },
};

export const formerMarriageEndLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Spouse’s former marriage'),
    endLocation: {
      'ui:description': () => (
        <>
          <h4>Where did the marriage end?</h4>
          <p>
            If your spouse got a divorce or an annulment, we want to know where
            they filed the paperwork. If the former spouse died, we want to know
            where the death certificate was filed.
          </p>
        </>
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
    required: ['endLocation'],
    properties: {
      endLocation: customLocationSchema,
    },
  },
};
