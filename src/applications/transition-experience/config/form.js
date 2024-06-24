// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../simple-forms/shared/components/GetFormHelp';
// Example of an imported schema:
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/NA-schema.json';

// import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
// import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
// import phoneUI from 'platform/forms-system/src/js/definitions/phone';
// import * as address from 'platform/forms-system/src/js/definitions/address';
// import fullSchema from '../NA-schema.json';

// import fullSchema from 'vets-json-schema/dist/NA-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

// pages
import serviceHistory from '../pages/serviceHistory';
import goals from '../pages/goals';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'transition-experience-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  stepLabels: 'Goals; Service History;',
  formId: 'T-QSTNR',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (NA) is in progress.',
    //   expired: 'Your saved benefits application (NA) has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'We have a few quick questions for you',
  subTitle:
    'Please answer the questions on the following few screens to help us recommend helpful resources and benefits.',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    transitionExperience: {
      pages: {
        goals: {
          path: 'goals',
          title: 'Goals',
          uiSchema: goals.uiSchema,
          schema: goals.schema,
        },
        serviceHistory: {
          path: 'service-history',
          title: 'Service History',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
