// import commonDefinitions from 'vets-json-schema/dist/definitions.json';
// import fullSchema from 'vets-json-schema/dist/22-10215-schema.json';
// import fullSchema from '../22-10215-schema.json';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import manifest from '../manifest.json';
import transform from './transform';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import { ProgramIntro } from '../pages/program-intro';
import { programInfo } from '../pages/program-info';
import { ProgramSummary } from '../pages/program-summary';

const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: '85/15 calculation',
  nounPlural: '85/15 calculations',
  required: true,
  text: {
    getItemName: item => item.programName,
  },
};

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
