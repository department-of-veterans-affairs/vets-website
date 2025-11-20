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
  textSchema,
  checkboxUI,
  checkboxSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from 'platform/utilities/data/get';
import {
  STATE_NAMES,
  STATE_VALUES,
  COUNTRY_NAMES,
  COUNTRY_VALUES,
  previousMarriageEndOptions,
} from '../../../utils/labels';
import { handleAlertMaxItems } from '../../../components/FormAlerts';

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
const options = {
  arrayPath: 'veteranMarriages',
  nounSingular: 'veteran marriage',
  nounPlural: 'veteran marriages',
  required: false,
  maxItems: 2,
  isItemIncomplete: item =>
    !item?.previousSpouseFullName || !item?.marriageDate,
  text: {
    alertMaxItems: handleAlertMaxItems,
    getItemName: item => {
      const { first, middle, last, suffix } =
        get('previousSpouseFullName', item) || {};
      const name = [first, middle, last, suffix].filter(Boolean).join(' ');
      return name || 'Previous marriage';
    },
    cardDescription: () => '',
    summaryTitle: () => "Review the Veteran's previous marriages",
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
  },
  schema: {
    type: 'object',
    properties: {
      'view:wasMarriedBefore': arrayBuilderYesNoSchema,
    },
    required: ['view:wasMarriedBefore'],
  },
};

const namePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      "Veteran's previous spouse's name",
    ),
    previousSpouseFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      previousSpouseFullName: fullNameSchema,
    },
    required: ['previousSpouseFullName'],
  },
};

const marriageDatePlacePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'When and where did they get married?',
    ),
    marriageDate: currentOrPastDateUI({
      title: 'Date of marriage',
      monthSelect: false,
      'ui:description':
        'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
      required: formData => !formData['view:marriageDate'],
    }),
    marriedOutsideUS: checkboxUI({
      title: 'They got married outside the U.S.',
    }),
    marriageLocation: {
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
      country: {
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
    required: ['marriageLocation', 'marriageDate'],
    properties: {
      marriageDate: currentOrPastDateSchema,
      marriedOutsideUS: checkboxSchema,
      marriageLocation: {
        type: 'object',
        required: ['city'],
        properties: {
          city: { type: 'string' },
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

const endedPage = {
  uiSchema: {
    marriageEndedBy: radioUI({
      title: 'How did the marriage end?',
      labels: previousMarriageEndOptions,
      labelHeaderLevel: 3,
    }),
    marriageEndedOther: textUI({
      title: 'Tell us how the marriage ended',
      expandUnder: 'marriageEndedBy',
      expandUnderCondition: field => field === 'OTHER',
      required: formData => formData?.marriageEndedBy === 'OTHER',
      errorMessages: { required: 'Please tell us how the marriage ended' },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      marriageEndedBy: radioSchema(Object.keys(previousMarriageEndOptions)),
      marriageEndedOther: textSchema,
    },
    required: ['marriageEndedBy'],
  },
};

const marriageEndDateLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'When and where did their marriage end?',
    ),
    dateOfTermination: currentOrPastDateUI({
      title: 'Date marriage ended',
      monthSelect: false,
      'ui:description':
        'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
      required: formData => !formData['view:dateOfTermination'],
    }),
    marriageEndedOutsideUS: checkboxUI({
      title: 'Their marriage ended outside the U.S.',
    }),
    marriageEndLocation: {
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
      country: {
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
    required: ['marriageEndLocation', 'dateOfTermination'],
    properties: {
      dateOfTermination: currentOrPastDateSchema,
      marriageEndedOutsideUS: checkboxSchema,
      marriageEndLocation: {
        type: 'object',
        required: ['city'],
        properties: {
          city: { type: 'string' },
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

export const veteranMarriagesPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    veteranMarriagesIntro: pageBuilder.introPage({
      title: 'Veteran’s previous marriages',
      path: 'household/veteran-previous-marriages',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    veteranMarriagesSummary: pageBuilder.summaryPage({
      title:
        'Was the Veteran married to someone else before being married to you?',
      path: 'household/veteran-previous-marriages/add',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    veteranPreviousSpouseName: pageBuilder.itemPage({
      title: "Veteran's previous spouse's name",
      path: 'household/veteran-previous-marriages/:index/spouse-name',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
    }),
    veteranMarriageDatePlace: pageBuilder.itemPage({
      title: 'When and where did they get married?',
      path: 'household/veteran-previous-marriages/:index/marriage-date-place',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: marriageDatePlacePage.uiSchema,
      schema: marriageDatePlacePage.schema,
    }),
    veteranMarriageEnded: pageBuilder.itemPage({
      title: 'How did the marriage end?',
      path: 'household/veteran-previous-marriages/:index/marriage-ended',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: endedPage.uiSchema,
      schema: endedPage.schema,
    }),
    veteranMarriageEndDateLocation: pageBuilder.itemPage({
      title: 'When and where did their marriage end?',
      path:
        'household/veteran-previous-marriages/:index/marriage-end-date-location',
      depends: formData =>
        formData.claimantRelationship === 'SPOUSE' &&
        formData.hadPreviousMarriages === true,
      uiSchema: marriageEndDateLocationPage.uiSchema,
      schema: marriageEndDateLocationPage.schema,
    }),
  }),
);

export default veteranMarriagesPages;
