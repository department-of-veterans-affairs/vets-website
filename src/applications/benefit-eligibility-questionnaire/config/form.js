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
import goals from '../pages/goals';
import disabilityRating from '../pages/disabilityRating';
import militaryService from '../pages/militaryService';
import separation from '../pages/separation';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'benefit-eligibility-questionnaire-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  stepLabels: 'Goals;Service;Separation;Disability',
  formId: 'T-QSTNR',
  saveInProgress: {
    messages: {
      inProgress: 'Your benefits questionnaire is in progress.',
      expired:
        'Your saved benefits questionnaire has expired. If you want to continue, please start a new questionnaire.',
      saved: 'Your benefits questionnaire has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Complete the benefit eligibility questionnaire',
  subTitle:
    'Please answer the questions to help us recommend helpful resources and benefits.',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    chapter1: {
      title: 'Goals',
      pages: {
        goals: {
          path: 'goals',
          title: 'Goals',
          uiSchema: goals.uiSchema,
          schema: goals.schema,
        },
      },
    },
    chapter2: {
      title: 'Service',
      pages: {
        militaryService: {
          path: 'military-service',
          title: 'Military Service',
          uiSchema: militaryService.uiSchema,
          schema: militaryService.schema,
        },
      },
    },
    chapter3: {
      title: 'Separation',
      pages: {
        separation: {
          path: 'separation',
          title: 'Separation',
          uiSchema: separation.uiSchema,
          schema: separation.schema,
        },
      },
    },
    chapter4: {
      title: 'Disability',
      pages: {
        disabilityRating: {
          path: 'disability-rating',
          title: 'Disability Rating',
          uiSchema: disabilityRating.uiSchema,
          schema: disabilityRating.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
