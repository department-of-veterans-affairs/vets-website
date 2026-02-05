import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  radioUI,
  radioSchema,
  fullNameUI,
  fullNameSchema,
  selectUI,
  textUI,
  checkboxUI,
  checkboxSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from 'platform/utilities/data/get';
import {
  STATE_NAMES,
  STATE_VALUES,
  COUNTRY_NAMES,
  COUNTRY_VALUES,
  previousMarriageEndOptions,
} from '../../../utils/labels';
import { handleVeteranMaxMarriagesAlert } from '../../../components/FormAlerts';
import { customAddressSchema } from '../../definitions';

/**
 * Pages for Veteran's previous marriages (array-builder)
 */

function introDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        Next we’ll ask you about the Veteran’s previous marriages. You may add
        up to 2 marriages.
      </p>
    </div>
  );
}
/** @type {ArrayBuilderOptions} */
// arrayPath is veteranMarriages because it's the Veteran's marriages being collected
const options = {
  arrayPath: 'veteranMarriages',
  nounSingular: 'previous marriage',
  nounPlural: 'previous marriages',
  required: false,
  maxItems: 2,
  isItemIncomplete: item => !item?.spouseFullName || !item?.dateOfMarriage,
  text: {
    cancelTitle: 'Cancel adding this previous marriage?',
    cancelAddTitle: 'Cancel adding this previous marriage?',
    cancelEditTitle: 'Cancel editing this previous marriage?',
    cancelDescription:
      'If you cancel, we won’t add this previous marriage to the list of marriages. You’ll return to a page where you can add another previous marriage for the Veteran.',
    cancelAddDescription:
      'If you cancel, we won’t add this previous marriage to the list of marriages. You’ll return to a page where you can add another previous marriage for the Veteran.',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made to this previous marriage and you will be returned to the previous marriage review page.',
    cancelYes: 'Yes, cancel adding',
    cancelAddYes: 'Yes, cancel adding',
    cancelNo: 'No, continue adding',
    cancelAddNo: 'No, continue adding',
    cancelEditYes: 'Yes, cancel editing',
    cancelEditNo: 'No, continue editing',
    deleteDescription:
      'This will delete the information from your list of previous marriages. You’ll return to a page where you can add a new previous marriage for the Veteran.',
    deleteNo: 'No, keep',
    deleteTitle: 'Delete this previous marriage?',
    deleteYes: 'Yes, delete',
    alertMaxItems: handleVeteranMaxMarriagesAlert,
    getItemName: item => {
      const { first, middle, last, suffix } = get('spouseFullName', item) || {};
      const name = [first, middle, last, suffix].filter(Boolean).join(' ');
      return name || 'Previous marriage';
    },
    summaryTitle: "Review the Veteran's previous marriages",
  },
};

const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Veteran’s previous marriages',
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
    'view:wasMarriedBefore': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Was the Veteran married to someone else before being married to you?',
        hint: '',
      },
      {
        title: 'Is there another previous marriage to add for the Veteran?',
        hint: '',
      },
    ),
    veteranHasAdditionalMarriages: {
      ...yesNoUI({
        title: 'Are there any other previous marriages to add for the Veteran?',
      }),
      'ui:required': formData => formData?.veteranMarriages?.length === 2,
      'ui:options': {
        hideIf: formData =>
          !formData?.veteranMarriages || formData?.veteranMarriages?.length < 2,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:wasMarriedBefore': arrayBuilderYesNoSchema,
      veteranHasAdditionalMarriages: yesNoSchema,
    },
    required: ['view:wasMarriedBefore'],
  },
};

const namePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      "Veteran's previous spouse's name",
    ),
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

const marriageDatePlacePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'When and where did they get married?',
    ),
    dateOfMarriage: currentOrPastDateUI({
      title: 'Date of marriage',
      monthSelect: false,
      'ui:description':
        'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
      required: formData => !formData['view:marriageDate'],
    }),
    marriedOutsideUS: checkboxUI({
      title: 'They got married outside the U.S.',
    }),
    locationOfMarriage: {
      city: textUI('City'),
      state: {
        ...selectUI('State', STATE_VALUES, STATE_NAMES),
        'ui:required': (formData, index) => {
          const item = formData?.veteranMarriages?.[index];
          const currentPageData = formData;
          return !(item?.marriedOutsideUS || currentPageData?.marriedOutsideUS);
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.veteranMarriages?.[index];
            const currentPageData = formData;
            return item?.marriedOutsideUS || currentPageData?.marriedOutsideUS;
          },
        },
      },
      otherCountry: {
        ...selectUI('Country', COUNTRY_VALUES, COUNTRY_NAMES),
        'ui:required': (formData, index) => {
          const item = formData?.veteranMarriages?.[index];
          const currentPageData = formData;
          return item?.marriedOutsideUS || currentPageData?.marriedOutsideUS;
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.veteranMarriages?.[index];
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
    required: ['locationOfMarriage', 'dateOfMarriage'],
    properties: {
      dateOfMarriage: currentOrPastDateSchema,
      marriedOutsideUS: checkboxSchema,
      locationOfMarriage: customAddressSchema,
    },
  },
};

const endedPage = {
  uiSchema: {
    reasonForSeparation: radioUI({
      title: 'How did the marriage end?',
      labels: previousMarriageEndOptions,
      labelHeaderLevel: 3,
    }),
    separationExplanation: textUI({
      title: 'Tell us how the marriage ended',
      expandUnder: 'reasonForSeparation',
      expandUnderCondition: field => field === 'OTHER',
      required: (formData, index) => {
        const item = formData?.veteranMarriages?.[index];
        const currentPageData = formData;
        return (
          item?.reasonForSeparation === 'OTHER' ||
          currentPageData?.reasonForSeparation === 'OTHER'
        );
      },
      errorMessages: { required: 'Please tell us how the marriage ended' },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      reasonForSeparation: radioSchema(Object.keys(previousMarriageEndOptions)),
      separationExplanation: {
        type: 'string',
        maxLength: 256,
      },
    },
    required: ['reasonForSeparation'],
  },
};

const marriageEndDateLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'When and where did their marriage end?',
    ),
    dateOfSeparation: currentOrPastDateUI({
      title: 'Date marriage ended',
      monthSelect: false,
      'ui:description':
        'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
      required: formData => !formData['view:dateOfSeparation'],
    }),
    marriageEndedOutsideUS: checkboxUI({
      title: 'Their marriage ended outside the U.S.',
    }),
    locationOfSeparation: {
      city: textUI('City'),
      state: {
        ...selectUI('State', STATE_VALUES, STATE_NAMES),
        'ui:required': (formData, index) => {
          const item = formData?.veteranMarriages?.[index];
          const currentPageData = formData;
          return !(
            item?.marriageEndedOutsideUS ||
            currentPageData?.marriageEndedOutsideUS
          );
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.veteranMarriages?.[index];
            const currentPageData = formData;
            return (
              item?.marriageEndedOutsideUS ||
              currentPageData?.marriageEndedOutsideUS
            );
          },
        },
      },
      otherCountry: {
        ...selectUI('Country', COUNTRY_VALUES, COUNTRY_NAMES),
        'ui:required': (formData, index) => {
          const item = formData?.veteranMarriages?.[index];
          const currentPageData = formData;
          return (
            item?.marriageEndedOutsideUS ||
            currentPageData?.marriageEndedOutsideUS
          );
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.veteranMarriages?.[index];
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
    required: ['locationOfSeparation', 'dateOfSeparation'],
    properties: {
      dateOfSeparation: currentOrPastDateSchema,
      marriageEndedOutsideUS: checkboxSchema,
      locationOfSeparation: customAddressSchema,
    },
  },
};

export const veteranMarriagesPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    veteranMarriagesIntro: pageBuilder.introPage({
      title: 'Veteran’s previous marriages',
      path: 'household/veteran-previous-marriages',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    veteranMarriagesSummary: pageBuilder.summaryPage({
      title:
        'Was the Veteran married to someone else before being married to you?',
      path: 'household/veteran-previous-marriages/add',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    veteranPreviousSpouseName: pageBuilder.itemPage({
      title: "Veteran's previous spouse's name",
      path: 'household/veteran-previous-marriages/:index/spouse-name',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
    }),
    veteranMarriageDatePlace: pageBuilder.itemPage({
      title: 'When and where did they get married?',
      path: 'household/veteran-previous-marriages/:index/marriage-date-place',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: marriageDatePlacePage.uiSchema,
      schema: marriageDatePlacePage.schema,
    }),
    veteranMarriageEnded: pageBuilder.itemPage({
      title: 'How did the marriage end?',
      path: 'household/veteran-previous-marriages/:index/marriage-ended',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: endedPage.uiSchema,
      schema: endedPage.schema,
    }),
    veteranMarriageEndDateLocation: pageBuilder.itemPage({
      title: 'When and where did their marriage end?',
      path:
        'household/veteran-previous-marriages/:index/marriage-end-date-location',
      depends: formData =>
        formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: marriageEndDateLocationPage.uiSchema,
      schema: marriageEndDateLocationPage.schema,
    }),
  }),
);

export default veteranMarriagesPages;

export { options };
