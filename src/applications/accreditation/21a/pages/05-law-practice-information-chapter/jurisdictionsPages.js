import { formatReviewDate } from '~/platform/forms-system/src/js/helpers';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'jurisdictions',
  nounSingular: 'jurisdiction',
  nounPlural: 'jurisdictions',
  required: true,
  isItemIncomplete: item =>
    !item?.name ||
    !item?.admissionDate ||
    !item?.membershipOrRegistrationNumber,
  text: {
    getItemName: item => item.name,
    cardDescription: item => formatReviewDate(item?.admissionDate),
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'Your practicing information',
      "Over the next couple of pages, we'll ask for information about jurisdictions and the agencies or courts you are currently admitted to practice before.",
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const jurisdictionPage = {
  uiSchema: {
    ...titleUI(
      'Jurisdiction',
      'Add details of a jurisdiction that you are admitted to practice before.',
    ),
    name: textUI('Name of jurisdiction'),
    admissionDate: currentOrPastDateUI('Date of admission'),
    membershipOrRegistrationNumber: textUI('Membership or registration number'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      admissionDate: currentOrPastDateSchema,
      membershipOrRegistrationNumber: textSchema,
    },
    required: ['name', 'admissionDate', 'membershipOrRegistrationNumber'],
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasJurisdictions': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {},
      {
        labelHeaderLevel: 'p',
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
    jurisdictions: pageBuilder.introPage({
      title: 'Practicing information',
      path: 'practicing-information',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
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
