import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  selectSchema,
  selectUI,
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { jurisdictionOptions } from '../../constants/jurisdictions';
import { formatReviewDate } from '../helpers/formatReviewDate';

import content from '../../locales/en/content.json';

/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath: 'jurisdictions',
  nounSingular: 'jurisdiction',
  nounPlural: 'jurisdictions',
  required: false,
  isItemIncomplete: item =>
    !item?.jurisdiction ||
    (item?.jurisdiction === 'Other' && !item?.otherJurisdiction) ||
    !item?.admissionDate ||
    !item?.membershipOrRegistrationNumber,
  text: {
    yesNoBlankReviewQuestion: () => content['jurisdiction-question'],
    reviewAddButtonText: () => content['jurisdiction-add-button-text'],
    getItemName: item =>
      item?.jurisdiction === 'Other'
        ? item?.otherJurisdiction
        : item?.jurisdiction,
    cardDescription: item =>
      `${formatReviewDate(item?.admissionDate)}, #${
        item?.membershipOrRegistrationNumber
      }`,
  },
};

/** @returns {PageSchema} */
const jurisdictionPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Jurisdiction',
      description:
        'List each jurisdiction to which you are admitted. You will be able to add additional jurisdictions on the next screen.',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    jurisdiction: selectUI('Jurisdiction'),
    otherJurisdiction: textUI({
      title: 'Name of jurisdiction',
      expandUnder: 'jurisdiction',
      expandUnderCondition: 'Other',
      required: (formData, index) =>
        formData?.jurisdictions?.[index]?.jurisdiction === 'Other',
    }),
    admissionDate: currentOrPastDateUI('Date of admission'),
    membershipOrRegistrationNumber: textUI('Membership or registration number'),
  },
  schema: {
    type: 'object',
    properties: {
      jurisdiction: selectSchema(jurisdictionOptions),
      otherJurisdiction: textSchema,
      admissionDate: currentOrPastDateSchema,
      membershipOrRegistrationNumber: textSchema,
    },
    required: [
      'jurisdiction',
      'admissionDate',
      'membershipOrRegistrationNumber',
    ],
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasJurisdictions': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {
        title:
          'Are you currently admitted to practice before any jurisdictions?',
        labelHeaderLevel: 'p',
        hint: ' ',
      },
      {
        labelHeaderLevel: 'p',
        hint: 'List each jurisdiction to which you are admitted.',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasJurisdictions': arrayBuilderYesNoSchema,
    },
    required: ['view:hasJurisdictions'],
  },
};

const jurisdictionsPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    jurisdictionsSummary: pageBuilder.summaryPage({
      title: 'Review your jurisdictions',
      path: 'jurisdictions-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    jurisdictionPage: pageBuilder.itemPage({
      title: 'Jurisdiction',
      path: 'jurisdictions/:index/jurisdiction',
      uiSchema: jurisdictionPage.uiSchema,
      schema: jurisdictionPage.schema,
    }),
  }),
);

export default jurisdictionsPages;
