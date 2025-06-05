import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  textSchema,
  textUI,
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns/titlePattern';
import { ConflictOfInterestIntro } from '../components/ConflictOfInterestIntro';
// import { conflictingInterests } from '../pages';

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
  uiSchema: {
    'view:introduction': {
      ...titleUI('Individuals with a potential conflict of interest'),
      'ui:description': ConflictOfInterestIntro,
    },
    'view:hasConflictingIndividuals': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Do you need to report any VA or SAA employees at your institution who may have a potential conflict of interest under this law?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title:
          'Do you have another individual with a potential conflict of interest to add?',
        labels: {
          Y: 'Yes, I have another individual to report',
          N: "No, I don't have another individual to report",
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:introduction': {
        type: 'object',
        properties: {},
      },
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
    conflictingIndividualsSummary: pageBuilder.summaryPage({
      title: 'Individuals with a potential conflict of interest',
      path: 'proprietary-profit-1',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    conflictingIndividualPage: pageBuilder.itemPage({
      title: 'Individuals affiliated with both your institution and VA or SAA',
      path: 'proprietary-profit-1/:index/details',
      uiSchema: individualPage.uiSchema,
      schema: individualPage.schema,
    }),
  }),
);
