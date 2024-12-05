// import commonDefinitions from 'vets-json-schema/dist/definitions.json';
// import fullSchema from 'vets-json-schema/dist/22-10215-schema.json';
// import fullSchema from '../22-10215-schema.json';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
// import {
//   arrayBuilderItemFirstPageTitleUI,
//   arrayBuilderYesNoSchema,
//   arrayBuilderYesNoUI,
//   descriptionUI,
//   selectSchema,
//   selectUI,
//   textareaSchema,
//   textareaUI,
// } from '~/platform/forms-system/src/js/web-component-patterns';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;
// const { } = commonDefinitions;

// pages
import { prepare } from '../pages/prepare';
import { programInfo } from '../pages/program-intro';
import { ProgramsTable } from '../pages/programs-table';

const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: '85/15 calculation',
  nounPlural: '85/15 calculations',
  required: true,
  maxItems: 1000,
  text: {
    getItemName: item => item.programName,
  },
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10215-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-10215',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for new form benefits.',
    noAuth:
      'Please sign in again to continue your application for new form benefits.',
  },
  title: 'Report 85/15 Rule enrollment ratios',
  defaultDefinitions: {},
  chapters: {
    programsChapter: {
      title: '85/15 calculations',
      pages: arrayBuilderPages(arrayBuilderOptions, pageBuilder => ({
        programsIntro: pageBuilder.introPage({
          path: '85/15-calculations',
          title: '85/15 calculations',
          uiSchema: prepare.uiSchema,
          schema: prepare.schema,
        }),
        programsSummary: pageBuilder.summaryPage({
          title: 'Review your 85/15 calculations',
          path: '85-15-calculations-review',
          uiSchema: ProgramsTable.uiSchema,
          schema: ProgramsTable.schema,
          CustomPage: props => ProgramsTable.table(props),
          CustomPageReview: null,
        }),
        addProgram: pageBuilder.itemPage({
          title: 'Program information',
          path: '85/15-calculations/:index/program-information',
          uiSchema: programInfo.uiSchema,
          schema: programInfo.schema,
        }),
      })),
    },
  },
};

export default formConfig;
