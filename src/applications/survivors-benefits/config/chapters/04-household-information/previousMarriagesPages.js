import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  fullNameSchema,
  fullNameUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  selectUI,
  radioUI,
  radioSchema,
  checkboxUI,
  checkboxSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import constants from 'vets-json-schema/dist/constants.json';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { previousMarriageEndOptions } from '../../../utils/labels';
import { handleAlertMaxItems } from '../../../components/FormAlerts';

// Helper function to determine if previous marriages section should be shown
const shouldShowPreviousMarriages = formData => {
  // Skip if YES recognized as spouse AND NO only ever married to each other
  if (
    formData.recognizedAsSpouse === true &&
    formData.hadPreviousMarriages === false
  ) {
    return false;
  }
  // Show if NO not recognized as spouse OR YES have been married before
  return (
    formData.recognizedAsSpouse === false ||
    formData.hadPreviousMarriages === true
  );
};

// Get military states to filter them out
const MILITARY_STATE_VALUES = constants.militaryStates.map(
  state => state.value,
);

// Get states from the same source as the addressUI component
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);
const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

// Get countries from the same source as the addressUI component
const COUNTRY_VALUES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.value);
const COUNTRY_NAMES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.label);

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'previousMarriages',
  nounSingular: 'previous marriage',
  nounPlural: 'previous marriages',
  required: false,
  minItems: 0,
  isItemIncomplete: item =>
    !item?.previousSpouseName?.first ||
    !item?.previousSpouseName?.last ||
    !item?.marriageToVeteranDate ||
    !item?.marriageLocation?.city ||
    (!item?.marriedOutsideUS && !item?.marriageLocation?.state) ||
    (item?.marriedOutsideUS && !item?.marriageLocation?.country) ||
    !item?.marriageEndReason ||
    (item?.marriageEndReason === 'OTHER' && !item?.marriageEndOtherExplanation),
  maxItems: 2,
  text: {
    alertMaxItems: handleAlertMaxItems,
    getItemName: item => {
      const name = item?.previousSpouseName;
      if (!name?.first && !name?.last) return '';

      const parts = [];
      if (name?.first) parts.push(name.first);
      if (name?.middle) parts.push(name.middle);
      if (name?.last) parts.push(name.last);
      if (name?.suffix) parts.push(name.suffix);

      return parts.join(' ');
    },
  },
};

function introDescription() {
  return (
    <div>
      <p>
        Next we'll ask you about your previous marriages before your marriage to
        the Veteran. You may add up to 2 marriages.
      </p>
      <p>
        <strong>Note:</strong> We usually don't need to contact a previous
        spouse of a Veteran's spouse. In very rare cases where we need
        information from this person, we'll contact you first.
      </p>
    </div>
  );
}

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Your previous marriages',
      nounSingular: options.nounSingular,
      nounPlural: options.nounPlural,
    }),
    'ui:description': introDescription,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:hasPreviousMarriages': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Do you have a marriage to add that was before your marriage to the Veteran?',
        hint: '',
      },
      {
        title: 'Do you have another previous marriage to add?',
        hint: '',
      },
    ),
  },
  schema: {
    type: 'object',
    required: ['view:hasPreviousMarriages'],
    properties: {
      'view:hasPreviousMarriages': arrayBuilderYesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
const previousMarriageItemPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Previous spouse name',
      nounSingular: options.nounSingular,
    }),
    previousSpouseName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      previousSpouseName: fullNameSchema,
    },
    required: ['previousSpouseName'],
  },
};

/** @returns {PageSchema} */
const marriageDateAndLocationPage = {
  uiSchema: {
    marriageToVeteranDate: currentOrPastDateUI({
      title: 'Date of marriage',
      monthSelect: false,
    }),
    marriedOutsideUS: checkboxUI({
      title: 'I got married outside the U.S.',
    }),
    marriageLocation: {
      city: textUI('City'),
      state: {
        ...selectUI('State'),
        'ui:required': (formData, index) => {
          const item = formData?.previousMarriages?.[index];
          const currentPageData = formData;
          return !(item?.marriedOutsideUS || currentPageData?.marriedOutsideUS);
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.previousMarriages?.[index];
            const currentPageData = formData;
            return item?.marriedOutsideUS || currentPageData?.marriedOutsideUS;
          },
          labels: STATE_VALUES.reduce((acc, value, idx) => {
            acc[value] = STATE_NAMES[idx];
            return acc;
          }, {}),
        },
        'ui:errorMessages': {
          required: 'Please select a state',
        },
      },
      country: {
        ...selectUI('Country'),
        'ui:required': (formData, index) => {
          const item = formData?.previousMarriages?.[index];
          const currentPageData = formData;
          return item?.marriedOutsideUS || currentPageData?.marriedOutsideUS;
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.previousMarriages?.[index];
            const currentPageData = formData;
            return !(
              item?.marriedOutsideUS || currentPageData?.marriedOutsideUS
            );
          },
          labels: COUNTRY_VALUES.reduce((acc, value, idx) => {
            acc[value] = COUNTRY_NAMES[idx];
            return acc;
          }, {}),
        },
        'ui:errorMessages': {
          required: 'Please select a country',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriageToVeteranDate', 'marriageLocation'],
    properties: {
      marriageToVeteranDate: currentOrPastDateSchema,
      marriedOutsideUS: checkboxSchema,
      marriageLocation: {
        type: 'object',
        required: ['city'],
        properties: {
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
            enum: STATE_VALUES,
            enumNames: STATE_NAMES,
          },
          country: {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          },
        },
      },
    },
  },
};

/** @returns {PageSchema} */
const marriageEndDateAndLocationPage = {
  uiSchema: {
    marriageEndDate: currentOrPastDateUI({
      title: 'Date marriage ended',
      monthSelect: false,
    }),
    marriageEndedOutsideUS: checkboxUI({
      title: 'My marriage ended outside the U.S.',
    }),
    marriageEndLocation: {
      city: textUI('City'),
      state: {
        ...selectUI('State'),
        'ui:required': (formData, index) => {
          const item = formData?.previousMarriages?.[index];
          const currentPageData = formData;
          return !(
            item?.marriageEndedOutsideUS ||
            currentPageData?.marriageEndedOutsideUS
          );
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.previousMarriages?.[index];
            const currentPageData = formData;
            return (
              item?.marriageEndedOutsideUS ||
              currentPageData?.marriageEndedOutsideUS
            );
          },
          labels: STATE_VALUES.reduce((acc, value, idx) => {
            acc[value] = STATE_NAMES[idx];
            return acc;
          }, {}),
        },
        'ui:errorMessages': {
          required: 'Please select a state',
        },
      },
      country: {
        ...selectUI('Country'),
        'ui:required': (formData, index) => {
          const item = formData?.previousMarriages?.[index];
          const currentPageData = formData;
          return (
            item?.marriageEndedOutsideUS ||
            currentPageData?.marriageEndedOutsideUS
          );
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.previousMarriages?.[index];
            const currentPageData = formData;
            return !(
              item?.marriageEndedOutsideUS ||
              currentPageData?.marriageEndedOutsideUS
            );
          },
          labels: COUNTRY_VALUES.reduce((acc, value, idx) => {
            acc[value] = COUNTRY_NAMES[idx];
            return acc;
          }, {}),
        },
        'ui:errorMessages': {
          required: 'Please select a country',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriageEndDate', 'marriageEndLocation'],
    properties: {
      marriageEndDate: currentOrPastDateSchema,
      marriageEndedOutsideUS: checkboxSchema,
      marriageEndLocation: {
        type: 'object',
        required: ['city'],
        properties: {
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
            enum: STATE_VALUES,
            enumNames: STATE_NAMES,
          },
          country: {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          },
        },
      },
    },
  },
};

/** @returns {PageSchema} */
const marriageEndPage = {
  uiSchema: {
    marriageEndReason: radioUI({
      title: 'How did the marriage end?',
      label: previousMarriageEndOptions,
    }),
    marriageEndOtherExplanation: {
      ...textUI({
        title: 'Tell us how the marriage ended',
        required: (formData, index) => {
          const item = formData?.previousMarriages?.[index];
          const currentPageData = formData;
          return (
            item?.marriageEndReason === 'OTHER' ||
            currentPageData?.marriageEndReason === 'OTHER'
          );
        },
      }),
      'ui:required': (formData, index) => {
        const item = formData?.previousMarriages?.[index];
        const currentPageData = formData;
        return (
          item?.marriageEndReason === 'OTHER' ||
          currentPageData?.marriageEndReason === 'OTHER'
        );
      },
      'ui:options': {
        expandUnder: 'marriageEndReason',
        expandUnderCondition: 'OTHER',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriageEndReason', 'marriageEndOtherExplanation'],
    properties: {
      marriageEndReason: radioSchema(Object.keys(previousMarriageEndOptions)),
      marriageEndOtherExplanation: {
        type: 'string',
      },
    },
  },
};

export const previousMarriagesPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    previousMarriagesIntro: pageBuilder.introPage({
      title: 'Your previous marriages',
      path: 'household/previous-marriage-intro',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    previousMarriagesSummary: pageBuilder.summaryPage({
      title:
        'Do you have a marriage to add that was before your marriage to the Veteran?',
      path: 'household/previous-marriage',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    previousMarriageItemPage: pageBuilder.itemPage({
      title: 'Previous spouse name',
      path: 'household/previous-marriage/:index/name',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: previousMarriageItemPage.uiSchema,
      schema: previousMarriageItemPage.schema,
    }),
    previousMarriageDateAndLocationPage: pageBuilder.itemPage({
      title: 'When and where did you get married?',
      path: 'household/previous-marriage/:index/date-and-location',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: marriageDateAndLocationPage.uiSchema,
      schema: marriageDateAndLocationPage.schema,
    }),
    previousMarriageEndPage: pageBuilder.itemPage({
      title: 'How did the marriage end?',
      path: 'household/previous-marriage/:index/end',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: marriageEndPage.uiSchema,
      schema: marriageEndPage.schema,
    }),
    previousMarriageEndDateAndLocationPage: pageBuilder.itemPage({
      title: 'When and where did your marriage end?',
      path: 'household/previous-marriage/:index/end-date-and-location',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: marriageEndDateAndLocationPage.uiSchema,
      schema: marriageEndDateAndLocationPage.schema,
    }),
  }),
);
