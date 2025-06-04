import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  // arrayBuilderItemSubsequentPageTitleUI,
  textSchema,
  textUI,
  radioUI,
  radioSchema,
  // titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import {
  uiSchema as conflictingInterestsUiSchema,
  schema as conflictingInterestsSchema,
} from './conflictingInterests';

const associationLabels = {
  vaEmployee:
    'They are a VA employee who works with, receives services from, or receives compensation from our institution',
  saaEmployee:
    'They are a SAA employee who works with or receives compensation from our institution',
};
const noSpaceOnlyPattern = '^(?!\\s*$).+';

const options = {
  arrayPath: 'conflictingIndividuals',
  nounSingular: 'individual',
  nounPlural: 'individuals',
  required: false,
  isItemIncomplete: item =>
    !item?.first || !item?.last || !item?.title || !item?.association,
  maxItems: 10,
  text: {
    getItemName: item => `${item?.first || ''} ${item?.last || ''}`.trim(),
    cardDescription: item => item?.title || '',
  },
};

const summaryPage = {
  // TODO figure how to make UI in conflictingInterests show up as first page in this list and loop
  uiSchema: {
    'view:hasConflictingIndividuals': arrayBuilderYesNoUI(
      options,
      // {
      //   title:
      //     'Do you ,need to report any VA or SAA employees at your institution who may have a potential conflict of interest under this law?',
      //   labels: {
      //     Y: 'Yes',
      //     N: 'No',
      //   },
      // },
      // null,
      {
        title:
          'Do you have another individual with a potential conflict of interest to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasConflictingIndividuals': arrayBuilderYesNoSchema,
    },
    required: ['view:hasConflictingIndividuals'],
  },
};

const individualPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Individuals affiliated with both your institution and VA or SAA',
      nounSingular: options.nounSingular,
    }),
    first: textUI({
      title: 'First name of individual',
      errorMessages: {
        required: 'You must provide a response',
        pattern: 'You must provide a response',
      },
    }),
    last: textUI({
      title: 'Last name of individual',
      errorMessages: {
        required: 'You must provide a response',
        pattern: 'You must provide a response',
      },
    }),
    title: textUI({
      title: 'Title of individual',
      errorMessages: {
        required: 'You must provide a response',
        pattern: 'You must provide a response',
      },
    }),
    association: radioUI({
      title: 'How is this individual associated with your institution?',
      errorMessages: { required: 'Please make a selection' },
      labels: associationLabels,
    }),
  },
  schema: {
    type: 'object',
    required: ['first', 'last', 'title', 'association'],
    properties: {
      first: { ...textSchema, pattern: noSpaceOnlyPattern },
      last: { ...textSchema, pattern: noSpaceOnlyPattern },
      title: { ...textSchema, pattern: noSpaceOnlyPattern },
      association: {
        ...radioSchema(['vaEmployee', 'saaEmployee']),
      },
    },
  },
};

export const conflictingIndividualsPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    conflictingInterests: pageBuilder.introPage({
      path: 'proprietary-profit-2', // TODO: verify path name
      title: 'Individuals with a potential conflict of interest',
      uiSchema: conflictingInterestsUiSchema,
      schema: conflictingInterestsSchema,
    }),
    conflictingIndividualsSummary: pageBuilder.summaryPage({
      title: 'Individuals with a potential conflict of interest',
      path: 'proprietary-profit-2',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      depends: formData => formData?.hasConflictOfInterest === true,
    }),
    conflictingIndividualPage: pageBuilder.itemPage({
      title: 'Individuals affiliated with both your institution and VA or SAA',
      path: 'proprietary-profit-2/:index/details',
      uiSchema: individualPage.uiSchema,
      schema: individualPage.schema,
    }),
  }),
);
