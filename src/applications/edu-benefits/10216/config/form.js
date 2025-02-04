import React from 'react';

import FormFooter from 'platform/forms/components/FormFooter';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import manifest from '../manifest.json';
import { validateFacilityCode } from '../utilities';
import { transform } from './submit-transformer';

// Components
import Alert from '../components/Alert';
import GetFormHelp from '../components/GetFormHelp';
import SubmissionInstructions from '../components/SubmissionInstructions';

// Pages
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import InstitutionDetails from '../pages/institutionDetails';
import studentRatioCalc from '../pages/studentRatioCalc';

const { date, dateRange } = commonDefinitions;

const subTitle = () => (
  <p className="schemaform-subtitle">
    35% Exemption Request from 85/15 Reporting Requirement (VA Form 22-10216)
  </p>
);

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  // submit: submitForm,
  submit: async formData => {
    return new Promise(resolve => {
      resolve({ status: 201, data: formData });
    });
  },
  trackingPrefix: 'edu-10216-',
  introduction: IntroductionPage,
  confirmation: ({ router, route }) => (
    <ConfirmationPage router={router} route={route} />
  ),
  formId: '22-10216',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-10216) is in progress.',
    //   expired: 'Your saved education benefits application (22-10216) has expired. If you want to apply for education benefits, please start a new application.',
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
  title: 'Request exemption from the 85/15 Rule reporting requirements',
  subTitle,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: {
    date,
    dateRange,
  },
  transformForSubmit: transform,
  chapters: {
    institutionDetailsChapter: {
      title: 'Institution Details',
      pages: {
        institutionDetails: {
          path: 'institution-details',
          title: 'Institution Details',
          onNavForward: async ({ formData, goPath }) => {
            const isAccredited = await validateFacilityCode(formData);
            localStorage.setItem('isAccredited', JSON.stringify(isAccredited));
            if (isAccredited) {
              goPath('/student-ratio-calculation');
            } else {
              goPath('/additional-form');
            }
          },
          uiSchema: InstitutionDetails().uiSchema,
          schema: InstitutionDetails().schema,
        },
        additionalErrorChapter: {
          title: 'Institution Details',
          path: 'additional-form',
          uiSchema: { 'ui:webComponentField': () => <Alert /> },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
    studentRatioCalcChapter: {
      title: 'Student ratio calculation',
      pages: {
        studentRatioCalc: {
          path: 'student-ratio-calculation',
          title: '35% exemption calculation',
          uiSchema: studentRatioCalc.uiSchema,
          schema: studentRatioCalc.schema,
          onNavBack: ({ goPath }) => {
            const isAccredited = JSON.parse(
              localStorage.getItem('isAccredited'),
            );
            if (isAccredited !== true) {
              goPath('/additional-form');
            } else {
              goPath('/institution-details');
            }
          },
        },
      },
    },
    submissionInstructionsChapter: {
      title: 'Submission instructions',
      pages: {
        submissionInstructions: {
          path: 'submission-instructions',
          title: '',
          uiSchema: {
            'ui:description': SubmissionInstructions,
            'ui:options': {
              hideOnReview: true,
            },
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export default formConfig;
