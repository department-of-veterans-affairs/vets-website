import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  fullNameUI,
  fullNameSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import ArrayTitle from '../../../components/ArrayTitle';
import { formatFullName, showMultiplePageResponse } from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'previousNames',
  nounSingular: 'previous name',
  nounPlural: 'previous names',
  customSummaryPageHeader: <ArrayTitle title="Other service names" />,
  required: false,
  isItemIncomplete: item =>
    !item?.previousFullName?.first || !item.previousFullName?.last, // include all required fields here
  text: {
    getItemName: item => formatFullName(item.previousFullName),
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingOtherNames': arrayBuilderYesNoUI(
      options,
      {
        title: 'Did you serve under another name?',
        labelHeaderLevel: ' ',
        hint: null,
        labels: {
          Y: 'Yes, I have a previous name to report',
          N: 'No, I don’t have a previous name to report',
        },
      },
      {
        title: 'Do you have another previous name to report?',
        labels: {
          Y: 'Yes, I have another previous name to report',
          N: 'No, I don’t have anymore previous names to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingOtherNames': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingOtherNames'],
  },
};

/** @returns {PageSchema} */
const otherNamePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Previous name',
      nounSingular: options.nounSingular,
    }),
    previousFullName: fullNameUI(title => `Previous ${title}`),
  },
  schema: {
    type: 'object',
    properties: {
      previousFullName: fullNameSchema,
    },
    required: ['previousFullName'],
  },
};

export const otherNamesPages = arrayBuilderPages(options, pageBuilder => ({
  otherNamesSummary: pageBuilder.summaryPage({
    title: 'Other service names',
    path: 'military/other-names/summary',
    depends: () => showMultiplePageResponse(),
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  otherNamePage: pageBuilder.itemPage({
    title: 'Other service names',
    path: 'military/other-names/:index/name',
    depends: () => showMultiplePageResponse(),
    uiSchema: otherNamePage.uiSchema,
    schema: otherNamePage.schema,
  }),
}));
