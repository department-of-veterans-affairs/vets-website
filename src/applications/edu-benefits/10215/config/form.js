// import React from 'react';
// import commonDefinitions from 'vets-json-schema/dist/definitions.json';
// import fullSchema from 'vets-json-schema/dist/22-10215-schema.json';
// import fullSchema from '../22-10215-schema.json';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  // arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;
// const { } = commonDefinitions;

// pages
import { prepare } from '../pages/prepare';
import { programInfo } from '../pages/program-intro';

function includeChapter(page) {
  return formData => formData?.chapterSelect?.[page];
}

const programOptions = {
  arrayPath: 'prepare',
  nounSingular: 'program',
  nounPlural: 'programs',
  required: true,
  maxItems: 10000,
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
      pages: {
        ...arrayBuilderPages(programOptions, pageBuilder => ({
          prepare: pageBuilder.introPage({
            path: '85/15-calculations-intro',
            title: '85/15 calculations',
            uiSchema: prepare.uiSchema,
            schema: prepare.schema,
          }),
          programSummary: pageBuilder.summaryPage({
            title: 'Review your 85/15 calculations',
            path: '85/15-calculations-summary',
            uiSchema: {
              'view:prepare': arrayBuilderYesNoUI(programOptions),
            },
            schema: {
              type: 'object',
              properties: {
                'view:prepare': arrayBuilderYesNoSchema,
              },
              required: ['view:prepare'],
            },
            depends: includeChapter('programIntro'),
          }),
          programIntro: pageBuilder.itemPage({
            title: 'Program information',
            path: '85/15-calculations/:index/program-information',
            uiSchema: programInfo.uiSchema,
            schema: programInfo.schema,
          }),
        })),
      },
    },
  },
};

export default formConfig;
