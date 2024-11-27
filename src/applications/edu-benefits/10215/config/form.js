// import React from 'react';
// import commonDefinitions from 'vets-json-schema/dist/definitions.json';
// import fullSchema from 'vets-json-schema/dist/22-10215-schema.json';
// import fullSchema from '../22-10215-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;
// const { } = commonDefinitions;

// pages
import { prepare } from '../pages/prepare';

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
        prepare: {
          path: '85/15-calculations-1',
          title: '85/15 calculations',
          uiSchema: prepare.uiSchema,
          schema: prepare.schema,
        },
      },
    },
  },
};

export default formConfig;
