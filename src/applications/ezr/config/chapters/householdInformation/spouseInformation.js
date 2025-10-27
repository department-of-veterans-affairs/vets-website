import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import spouseInformationSummaryPage from '../../../definitions/spouseInformationSummary';
import spousePersonalInformationPage from '../../../definitions/spousePersonalInformation';

import content from '../../../locales/en/content.json';
import SpouseSummaryCardDescription from '../../../components/FormDescriptions/SpouseSummaryCardDescription';
import SpouseInformationReviewWarning from '../../../components/FormAlerts/SpouseInformationReviewWarning';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'spouseInformation',
  nounSingular: 'spouse',
  nounPlural: 'spouse',
  required: false,
  maxItems: 1,
  hideMaxItemsAlert: true,
  text: {
    getItemName: item => {
      return `${item.spouseFullName.first} ${item.spouseFullName.last}`;
    },
    summaryDescription: () => (
      <SpouseInformationReviewWarning
        isFormReviewPage={window?.location?.pathname.includes(
          'review-and-submit',
        )}
      />
    ),
    cardDescription: item => {
      return item && <SpouseSummaryCardDescription item={item} />;
    },
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

const spousalInformationPages = arrayBuilderPages(options, pageBuilder => ({
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
}));

export default spousalInformationPages;
