import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import spouseInformationSummaryPage from '../../../definitions/spouseInformationSummary';
import spousePersonalInformationPage from '../../../definitions/spousePersonalInformation';
import spouseAdditionalInformationPage from '../../../definitions/spouseAdditionalInformation';
import spouseContactInformationPage from '../../../definitions/spouseContactInformation';
import spouseFinancialSupportPage from '../../../definitions/spouseFinancialSupport';
import content from '../../../locales/en/content.json';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'spouseInformation',
  nounSingular: 'spouse',
  nounPlural: 'spouse',
  required: false,
  isItemIncomplete: item => !item?.name,
  maxItems: 1,
  hideMaxItemsAlert: true,
  text: {
    cardDescription: item => {
      return item && <div>Custom card description</div>;
    },
  },
};

/**
 * Schemas for spouse information summary page.
 *
 * @returns {PageSchema}
 */
const spouseInformationSummaryPageSchema = spouseInformationSummaryPage(
  options,
);

/**
 * Schemas for spouse personal information page.
 *
 * @returns {PageSchema}
 */
const spousePersonalInformationPageSchema = spousePersonalInformationPage(
  options,
);

/**
 * Schemas for spouse additional information page.
 *
 * @returns {PageSchema}
 */
const spouseAdditionalInformationPageSchema = spouseAdditionalInformationPage(
  options,
);

/**
 * Schemas for spouse contact information page.
 *
 * @returns {PageSchema}
 */
const spouseContactInformationPageSchema = spouseContactInformationPage(
  options,
);

/**
 * Schemas for spouse financial support page.
 *
 * @returns {PageSchema}
 */
const spouseFinancialSupportPageSchema = spouseFinancialSupportPage(options);

export const spousalInformationPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    spouseInformationSummaryPage: pageBuilder.summaryPage({
      title: content['household-spouse-information-summary-title'],
      path: 'household-information/spouse-information',
      uiSchema: spouseInformationSummaryPageSchema.uiSchema,
      schema: spouseInformationSummaryPageSchema.schema,
    }),
    spousePersonalInformationPage: pageBuilder.itemPage({
      title: content['household-spouse-information-title'],
      path:
        'household-information/spouse-information/:index/spouse-personal-information',
      uiSchema: spousePersonalInformationPageSchema.uiSchema,
      schema: spousePersonalInformationPageSchema.schema,
    }),
    spouseAdditionalInformationPage: pageBuilder.itemPage({
      title: 'Additional information',
      path:
        'household-information/spouse-information/:index/spouse-additional-information',
      uiSchema: spouseAdditionalInformationPageSchema.uiSchema,
      schema: spouseAdditionalInformationPageSchema.schema,
    }),
    spouseFinancialSupportPage: pageBuilder.itemPage({
      title: 'Financial support',
      path:
        'household-information/spouse-information/:index/spouse-financial-support',
      uiSchema: spouseFinancialSupportPageSchema.uiSchema,
      schema: spouseFinancialSupportPageSchema.schema,
    }),
    spouseContactInformationPage: pageBuilder.itemPage({
      title: 'Contact information',
      path:
        'household-information/spouse-information/:index/spouse-contact-information',
      uiSchema: spouseContactInformationPageSchema.uiSchema,
      schema: spouseContactInformationPageSchema.schema,
    }),
  }),
);
