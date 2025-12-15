import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  includeSpousalInformationV2,
  spouseAddressDoesNotMatchVeteransV2,
  spouseDidNotCohabitateWithVeteranV2,
} from 'applications/ezr/utils/helpers/form-config';
import { spouseInformationIntroPage } from 'applications/ezr/definitions/spouseInformationIntro';
import spouseInformationSummaryPage from '../../../definitions/spouseInformationSummary';
import spousePersonalInformationPage from '../../../definitions/spousePersonalInformation';
import { spouseAdditionalInformationPage } from '../../../definitions/spouseAdditionalInformation';
import { spouseFinancialSupportPage } from '../../../definitions/spouseFinancialSupport';
import { spouseContactInformationPage } from '../spouseContactInformation';
import content from '../../../locales/en/content.json';
import SpouseSummaryCardDescription from '../../../components/FormDescriptions/SpouseSummaryCardDescription';
import SpouseInformationReviewWarning from '../../../components/FormAlerts/SpouseInformationReviewWarning';
import { isItemIncomplete } from '../../../utils/helpers/spouseUtils';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'spouseInformation',
  nounSingular: 'spouse',
  nounPlural: 'spouse',
  required: true,
  maxItems: 1,
  hideMaxItemsAlert: true,
  isItemIncomplete,
  text: {
    getItemName: item => {
      const firstName = item?.spouseFullName?.first || '';
      const lastName = item?.spouseFullName?.last || '';
      return `${firstName} ${lastName}`.trim() || 'Spouse';
    },
    summaryDescription: () => (
      <SpouseInformationReviewWarning
        isFormReviewPage={window?.location?.pathname.includes(
          'review-and-submit',
        )}
      />
    ),
    cardDescription: SpouseSummaryCardDescription,
    cancelAddDescription: () =>
      content['household-spouse-add-cancel-modal-text'],
    cancelEditDescription: () =>
      content['household-spouse-edit-cancel-modal-text'],
    cancelAddYes: () => content['household-spouse-add-cancel-modal-button-yes'],
    cancelAddNo: () => content['household-spouse-add-cancel-modal-button-no'],
    cancelEditNo: () => content['household-spouse-edit-cancel-modal-button-no'],
    cancelEditYes: () =>
      content['household-spouse-edit-cancel-modal-button-yes'],
    cancelAddTitle: () => content['household-spouse-add-cancel-modal-title'],
    cancelEditTitle: () => content['household-spouse-edit-cancel-modal-title'],
  },
};

/**
 * Schemas for spouse information intro page.
 *
 * @returns {PageSchema}
 */
const spouseInformationIntroPageSchema = spouseInformationIntroPage;

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
const spouseAdditionalInformationPageSchema = spouseAdditionalInformationPage;

/**
 * Schemas for spouse contact information page.
 *
 * @returns {PageSchema}
 */
const spouseContactInformationPageSchema = spouseContactInformationPage;

/**
 * Spouse confirmation flow (ArrayBuilder/List and Loop) form pages.
 *
 * @returns {PageSchema}
 */
const spouseFinancialSupportPageSchema = spouseFinancialSupportPage;

const spousalInformationPages = arrayBuilderPages(options, pageBuilder => ({
  spouseInformationIntroPage: pageBuilder.introPage({
    title: content['household-spouse-intro-title'],
    path: 'household-information/spouse-information',
    uiSchema: spouseInformationIntroPageSchema.uiSchema,
    schema: spouseInformationIntroPageSchema.schema,
    depends: includeSpousalInformationV2,
  }),
  spouseInformationSummaryPage: pageBuilder.summaryPage({
    title: content['household-spouse-information-summary-title'],
    path: 'household-information/spouse-information-summary',
    uiSchema: spouseInformationSummaryPageSchema.uiSchema,
    schema: spouseInformationSummaryPageSchema.schema,
    depends: includeSpousalInformationV2,
  }),
  spousePersonalInformationPage: pageBuilder.itemPage({
    title: content['household-spouse-information-title'],
    path:
      'household-information/spouse-information/:index/personal-information',
    uiSchema: spousePersonalInformationPageSchema.uiSchema,
    schema: spousePersonalInformationPageSchema.schema,
    depends: includeSpousalInformationV2,
  }),
  spouseAdditionalInformationPage: pageBuilder.itemPage({
    title: content['household-spouse-addtl-info-title'],
    path:
      'household-information/spouse-information/:index/additional-information',
    uiSchema: spouseAdditionalInformationPageSchema.uiSchema,
    schema: spouseAdditionalInformationPageSchema.schema,
    depends: includeSpousalInformationV2,
  }),
  spouseFinancialSupportPage: pageBuilder.itemPage({
    title: content['household-spouse-support-title'],
    path: 'household-information/spouse-information/:index/financial-support',
    uiSchema: spouseFinancialSupportPageSchema.uiSchema,
    schema: spouseFinancialSupportPageSchema.schema,
    depends: spouseDidNotCohabitateWithVeteranV2,
  }),
  spouseContactInformationPage: pageBuilder.itemPage({
    title: content['household-spouse-contact-info-title'],
    path: 'household-information/spouse-information/:index/contact-information',
    uiSchema: spouseContactInformationPageSchema.uiSchema,
    schema: spouseContactInformationPageSchema.schema,
    depends: spouseAddressDoesNotMatchVeteransV2,
  }),
}));

export default spousalInformationPages;
