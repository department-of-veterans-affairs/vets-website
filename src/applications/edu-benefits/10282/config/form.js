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
  applicantState,
  genderRaceQuestion,
  applicantRaceAndEthnicity,
} from '../pages';

const { fullName, usaPhone, email } = fullSchema10282?.definitions;

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
    usaPhone,
    email,
  },
  chapters: {
    personalInformation: {
      title: 'Your personal information',
      pages: {
        applicantName: applicantInformationName.applicantInformationField(),
        veteranDesc: {
          title: 'Your personal information',
          path: 'applicant-information-1',
          uiSchema: veteranDesc.uiSchema,
          schema: veteranDesc.schema,
        },
        contactInfo: {
          title: 'Your personal information',
          path: 'applicant-information-2',
          uiSchema: applicantContactInfo.uiSchema,
          schema: applicantContactInfo.schema,
        },
        applicantCountry: {
          title: 'Your personal information',
          path: 'applicant-information-3',
          uiSchema: applicantInformationCountry.uiSchema,
          schema: applicantInformationCountry.schema,
        },
        applicantState: {
          title: 'Your personal information',
          path: 'applicant-information-4',
          uiSchema: applicantState.uiSchema,
          schema: applicantState.schema,
          depends: formData => formData.country === 'United States',
        },
        genderRaceQuestion: {
          title: 'Your personal information',
          path: 'applicant-information-5',
          uiSchema: genderRaceQuestion.uiSchema,
          schema: genderRaceQuestion.schema,
        },
        applicantRaceAndEthnicity: {
          title: 'Your personal information',
          path: 'applicant-information-6',
          uiSchema: applicantRaceAndEthnicity.uiSchema,
          schema: applicantRaceAndEthnicity.schema,
          depends: formData => formData.raceAndGender === 'Yes',
        },
      },
    },
  },
};
export default formConfig;
