import React from 'react';

import {
  textUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

import { employmentAppliedFields } from '../definitions/constants';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: employmentAppliedFields.parentObject,
  nounSingular: 'employment application record',
  nounPlural: 'employment application records',
  required: false,
  isItemIncomplete: item =>
    !item?.[employmentAppliedFields.employerName] ||
    !item?.[employmentAppliedFields.typeOfWork] ||
    !item?.[employmentAppliedFields.employerAddress] ||
    !item?.[employmentAppliedFields.dateApplied],
  maxItems: 3,
  text: {
    getItemName: item =>
      item[employmentAppliedFields.employerName] || 'Employer',
    cardDescription: item => {
      const parts = [];

      if (item?.[employmentAppliedFields.typeOfWork]) {
        parts.push(item[employmentAppliedFields.typeOfWork]);
      }

      if (item?.[employmentAppliedFields.dateApplied]) {
        parts.push(
          `Applied: ${formatReviewDate(
            item[employmentAppliedFields.dateApplied],
          )}`,
        );
      }

      return parts.join(' • ');
    },
  },
};

/**
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    [employmentAppliedFields.hasTriedEmployment]: arrayBuilderYesNoUI(options, {
      title: (
        <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--0">
          Have you tried to obtain employment since you became too disabled to work?
        </h3>
      ),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [employmentAppliedFields.hasTriedEmployment]: arrayBuilderYesNoSchema,
    },
    required: [employmentAppliedFields.hasTriedEmployment],
  },
};

/** @returns {PageSchema} */
const employmentInformationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: (
        <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--0">
          Employer information
        </h3>
      ),
      nounSingular: options.nounSingular,
    }),
    [employmentAppliedFields.employerName]: textUI({
      title: 'Name of employer',
    }),
    [employmentAppliedFields.employerAddress]: addressNoMilitaryUI({
      title: 'Employer address',
      omit: ['street3'],
    }),
    [employmentAppliedFields.typeOfWork]: textUI('Type of work applied for'),
    [employmentAppliedFields.dateApplied]: currentOrPastDateUI({
      title: 'Date you applied for employment',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [employmentAppliedFields.employerName]: {
        type: 'string',
        maxLength: 100,
      },
      [employmentAppliedFields.employerAddress]: addressNoMilitarySchema({
        omit: ['street3'],
      }),
      [employmentAppliedFields.typeOfWork]: {
        type: 'string',
        maxLength: 100,
      },
      [employmentAppliedFields.dateApplied]: currentOrPastDateSchema,
    },
    required: [
      employmentAppliedFields.employerName,
      employmentAppliedFields.employerAddress,
      employmentAppliedFields.typeOfWork,
      employmentAppliedFields.dateApplied,
    ],
  },
};

export default arrayBuilderPages(options, pageBuilder => ({
  employmentHistorySummary: pageBuilder.summaryPage({
    title: (
      <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--0">
        Review your employment application records
      </h3>
    ),
    path: 'employment-application-records-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  employmentHistoryPage: pageBuilder.itemPage({
    title: (
      <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--0">
        Employment application record
      </h3>
    ),
    path: 'employment-application-record/:index/',
    uiSchema: employmentInformationPage.uiSchema,
    schema: employmentInformationPage.schema,
  }),
}));
