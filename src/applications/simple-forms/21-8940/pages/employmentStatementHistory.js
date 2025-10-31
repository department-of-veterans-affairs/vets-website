import {
  titleUI,
  textUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  yesNoUI,
  yesNoSchema,
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
  maxItems: 4,
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

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'Employment application records',
      `Can enter up to ${options.maxItems} employment application records`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    [employmentAppliedFields.hasTriedEmployment]: arrayBuilderYesNoUI(options, {
      title:
        'Have you tried to obtain employment since you became too disabled to work?',
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
      title: 'Employer information',
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
 /* employmentHistoryIntro: pageBuilder.introPage({
    title: 'Employment application records',
    path: 'employment-application-statement',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),*/
  employmentHistorySummary: pageBuilder.summaryPage({
    title: 'Review your employment application records',
    path: 'employment-application-records-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  employmentHistoryPage: pageBuilder.itemPage({
    title: 'Employment application record',
    path: 'employment-application-record/:index/',
    uiSchema: employmentInformationPage.uiSchema,
    schema: employmentInformationPage.schema,
  }),
}));
