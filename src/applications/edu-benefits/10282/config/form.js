import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  applicantInformationName,
  applicantInformationCountry,
  veteranDesc,
  applicantContactInfo,
} from '../pages';

const { fullName, description } = fullSchema10282?.definitions;

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
  title: 'Apply for the IBM SkillsBuild Program',
  subTitle:
    'IBM SkillsBuild Training Program Intake Application (VA Form 22-10282)',
  defaultDefinitions: {
    fullName,
    description,
  },
  chapters: {
    personalInformation: {
      title: 'Your personal information',
      pages: {
        applicantName: {
          path: 'applicant-information',
          title: 'Applicant Information',
          uiSchema: applicantInformationName.uiSchema,
          schema: applicantInformationName.schema,
        },
        veteranDesc: {
          path: 'applicant-information-1',
          title: 'Applicant Information',
          uiSchema: veteranDesc.uiSchema,
          schema: veteranDesc.schema,
        },
        applicantCountry: {
          title: 'Applicant Information',
          path: 'applicant-information-2',
          uiSchema: applicantInformationCountry.uiSchema,
          schema: applicantInformationCountry.schema,
        },
        contactInfo: {
          title: 'Applicant Information',
          path: 'applicant-information-3',
          uiSchema: applicantContactInfo.uiSchema,
          schema: applicantContactInfo.schema,
        },
      },
    },
  },
};

export default formConfig;
