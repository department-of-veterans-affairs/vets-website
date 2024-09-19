import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';


const { fullName } = fullSchema10282?.definitions;
console.log(fullSchema10282, 'fullSchema10282')
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10282-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10282,
  saveInProgress: {
    messages: {
      inProgress:
        'Your 	education benefits application (22-10282) is in progress.',
      expired:
        'Your saved 	education benefits application (22-10282) has expired. If you want to apply for 	education benefits, please start a new application.',
      saved: 'Your 	education benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for 	education benefits.',
    noAuth:
      'Please sign in again to continue your application for 	education benefits.',
  },
  title: 'Complex Form',
  defaultDefinitions: {
    fullName,
  },
  chapters: {
    applicantInformationChapter: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant/information',
          title: 'Applicant information',
          uiSchema: {
            veteranFullName: fullNameUI,
          },
        },
      },
    },
  },
};

export default formConfig;
