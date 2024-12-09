import React from 'react';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { CalculationInstructions } from '../components/CalculationInstructions';
// pages
import { institutionDetails } from '../pages';

const { date } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10215-',
  // introduction: IntroductionPage,
  introduction: CalculationInstructions,
  confirmation: ConfirmationPage,
  formId: '22-10215',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-10215) is in progress.',
    //   expired: 'Your saved education benefits application (22-10215) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
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
  },
};

export default formConfig;
