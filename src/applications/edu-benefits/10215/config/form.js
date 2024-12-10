import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import manifest from '../manifest.json';
import transform from './transform';

// Pages
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  institutionDetails,
  ProgramIntro,
  programInfo,
  ProgramSummary,
} from '../pages';

const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: 'program',
  nounPlural: 'programs',
  required: true,
  text: {
    getItemName: item => item.programName,
  },
};

const { date } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  transformForSubmit: transform,
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
      'Please sign in again to continue your application for education benefits.',
  },
  title: 'Report 85/15 Rule enrollment ratios',
  subTitle: () => (
    <p className="vads-u-margin-bottom--0">
      Statement of Assurance of Compliance with 85% Enrollment Ratios (VA Form
      22-10215)
    </p>
  ),
  defaultDefinitions: {
    date,
  },
  chapters: {
    institutionDetailsChapter: {
      title: 'Institution details',
      pages: {
        institutionDetails: {
          path: 'institution-details',
          title: 'Institution details',
          uiSchema: institutionDetails.uiSchema,
          schema: institutionDetails.schema,
        },
      },
    },
    programsChapter: {
      title: '85/15 calculations',
      pages: arrayBuilderPages(arrayBuilderOptions, pageBuilder => ({
        programsIntro: pageBuilder.introPage({
          path: '85/15-calculations',
          title: '[noun plural]',
          uiSchema: ProgramIntro.uiSchema,
          schema: ProgramIntro.schema,
        }),
        programsSummary: pageBuilder.summaryPage({
          title: 'Review your [noun plural]',
          path: '85-15-calculations/summary',
          uiSchema: ProgramSummary.uiSchema,
          schema: ProgramSummary.schema,
        }),
        addProgram: pageBuilder.itemPage({
          title: 'Program information',
          path: '85/15-calculations/:index',
          showPagePerItem: true,
          uiSchema: programInfo.uiSchema,
          schema: programInfo.schema,
        }),
      })),
    },
  },
};

export default formConfig;
