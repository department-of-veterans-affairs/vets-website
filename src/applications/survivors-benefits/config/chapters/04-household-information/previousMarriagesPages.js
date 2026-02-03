import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
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
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import constants from 'vets-json-schema/dist/constants.json';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { previousMarriageEndOptions } from '../../../utils/labels';
import { handleSpouseMaxMarriagesAlert } from '../../../components/FormAlerts';

// Show previous marriages pages ONLY if user answered YES to hadPreviousMarriages
// Ansering NO skips all previous marriage flows and jumps to Dependents
const shouldShowPreviousMarriages = formData =>
  formData.hadPreviousMarriages === true;

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
// arrayPath is spouseMarriages because it's the spouse's previous marriages
export const options = {
  arrayPath: 'spouseMarriages',
  nounSingular: 'previous marriage',
  nounPlural: 'previous marriages',
  required: false,
  minItems: 0,
  isItemIncomplete: item =>
    !item?.spouseFullName?.first ||
    !item?.spouseFullName?.last ||
    !item?.dateOfMarriage ||
    !item?.locationOfMarriage?.city ||
    (!item?.marriedOutsideUS && !item?.locationOfMarriage?.state) ||
    (item?.marriedOutsideUS && !item?.locationOfMarriage?.otherCountry) ||
    !item?.reasonForSeparation ||
    (item?.reasonForSeparation === 'OTHER' && !item?.separationExplanation),
  maxItems: 2,
  text: {
    cancelAddTitle: 'Cancel adding this previous marriage?',
    cancelEditTitle: 'Cancel editing this previous marriage?',
    cancelAddDescription:
      'If you cancel, we won’t add this previous marriage to the list of marriages. You’ll return to a page where you can add another previous marriage.',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made to this previous marriage and you will be returned to the previous marriage review page.',
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding',
    cancelEditYes: 'Yes, cancel editing',
    cancelEditNo: 'No, continue editing',
    deleteDescription:
      'This will delete the information from your list of previous marriages. You’ll return to a page where you can add a new previous marriage.',
    deleteNo: 'No, keep',
    deleteTitle: 'Delete this previous marriage?',
    deleteYes: 'Yes, delete',
    alertMaxItems: handleSpouseMaxMarriagesAlert,
    getItemName: item => {
      const name = item?.spouseFullName;
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
        <strong>Note:</strong> We usually don’t need to contact a previous
        spouse. In very rare cases where we need information from this person,
        we’ll contact you first.
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
    spouseHasAdditionalMarriages: {
      ...yesNoUI({
        title:
          'Are there any other marriages to add that were before your marriage to the Veteran?',
      }),
      'ui:required': formData => formData?.spouseMarriages?.length === 2,
      'ui:options': {
        hideIf: formData =>
          !formData?.spouseMarriages || formData?.spouseMarriages?.length < 2,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['view:hasPreviousMarriages'],
    properties: {
      'view:hasPreviousMarriages': arrayBuilderYesNoSchema,
      spouseHasAdditionalMarriages: yesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
const previousMarriageItemPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Previous spouse’s name',
      nounSingular: options.nounSingular,
    }),
    spouseFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      spouseFullName: fullNameSchema,
    },
    required: ['spouseFullName'],
  },
};

/** @returns {PageSchema} */
const marriageDateAndLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'When and where did you get married?',
    ),
    dateOfMarriage: currentOrPastDateUI({
      title: 'Date of marriage',
      monthSelect: false,
    }),
    marriedOutsideUS: checkboxUI({
      title: 'I got married outside the U.S.',
    }),
    locationOfMarriage: {
      city: textUI('City'),
      state: {
        ...selectUI('State'),
        'ui:required': (formData, index) => {
          const item = formData?.spouseMarriages?.[index];
          const currentPageData = formData;
          return !(item?.marriedOutsideUS || currentPageData?.marriedOutsideUS);
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.spouseMarriages?.[index];
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
      otherCountry: {
        ...selectUI('Country'),
        'ui:required': (formData, index) => {
          const item = formData?.spouseMarriages?.[index];
          const currentPageData = formData;
          return item?.marriedOutsideUS || currentPageData?.marriedOutsideUS;
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.spouseMarriages?.[index];
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
    required: ['dateOfMarriage', 'locationOfMarriage'],
    properties: {
      dateOfMarriage: currentOrPastDateSchema,
      marriedOutsideUS: checkboxSchema,
      locationOfMarriage: {
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
          otherCountry: {
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      'When and where did your marriage end?',
    ),
    dateOfSeparation: currentOrPastDateUI({
      title: 'Date marriage ended',
      monthSelect: false,
    }),
    marriageEndedOutsideUS: checkboxUI({
      title: 'My marriage ended outside the U.S.',
    }),
    locationOfSeparation: {
      city: textUI('City'),
      state: {
        ...selectUI('State'),
        'ui:required': (formData, index) => {
          const item = formData?.spouseMarriages?.[index];
          const currentPageData = formData;
          return !(
            item?.marriageEndedOutsideUS ||
            currentPageData?.marriageEndedOutsideUS
          );
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.spouseMarriages?.[index];
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
      otherCountry: {
        ...selectUI('Country'),
        'ui:required': (formData, index) => {
          const item = formData?.spouseMarriages?.[index];
          const currentPageData = formData;
          return (
            item?.marriageEndedOutsideUS ||
            currentPageData?.marriageEndedOutsideUS
          );
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.spouseMarriages?.[index];
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
    required: ['dateOfSeparation', 'locationOfSeparation'],
    properties: {
      dateOfSeparation: currentOrPastDateSchema,
      marriageEndedOutsideUS: checkboxSchema,
      locationOfSeparation: {
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
          otherCountry: {
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
    reasonForSeparation: radioUI({
      title: 'How did the marriage end?',
      labels: previousMarriageEndOptions,
      labelHeaderLevel: 3,
    }),
    separationExplanation: {
      ...textUI({
        title: 'Tell us how the marriage ended',
        required: (formData, index) => {
          const item = formData?.spouseMarriages?.[index];
          const currentPageData = formData;
          return (
            item?.reasonForSeparation === 'OTHER' ||
            currentPageData?.reasonForSeparation === 'OTHER'
          );
        },
      }),
      'ui:required': (formData, index) => {
        const item = formData?.spouseMarriages?.[index];
        const currentPageData = formData;
        return (
          item?.reasonForSeparation === 'OTHER' ||
          currentPageData?.reasonForSeparation === 'OTHER'
        );
      },
      'ui:options': {
        expandUnder: 'reasonForSeparation',
        expandUnderCondition: 'OTHER',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['reasonForSeparation'],
    properties: {
      reasonForSeparation: radioSchema(Object.keys(previousMarriageEndOptions)),
      separationExplanation: {
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
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    previousMarriagesSummary: pageBuilder.summaryPage({
      title:
        'Do you have a marriage to add that was before your marriage to the Veteran?',
      path: 'household/previous-marriage',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    previousMarriageItemPage: pageBuilder.itemPage({
      title: 'Previous spouse’s name',
      path: 'household/previous-marriage/:index/name',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: previousMarriageItemPage.uiSchema,
      schema: previousMarriageItemPage.schema,
    }),
    previousMarriageDateAndLocationPage: pageBuilder.itemPage({
      title: 'When and where did you get married?',
      path: 'household/previous-marriage/:index/date-and-location',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: marriageDateAndLocationPage.uiSchema,
      schema: marriageDateAndLocationPage.schema,
    }),
    previousMarriageEndPage: pageBuilder.itemPage({
      title: 'How did the marriage end?',
      path: 'household/previous-marriage/:index/end',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: marriageEndPage.uiSchema,
      schema: marriageEndPage.schema,
    }),
    previousMarriageEndDateAndLocationPage: pageBuilder.itemPage({
      title: 'When and where did your marriage end?',
      path: 'household/previous-marriage/:index/end-date-and-location',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        shouldShowPreviousMarriages(formData),
      uiSchema: marriageEndDateAndLocationPage.uiSchema,
      schema: marriageEndDateAndLocationPage.schema,
    }),
  }),
);
