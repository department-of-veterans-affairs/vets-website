import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';


import {
  nameAndDateOfBirth,
  identificationInformation,
  employmentStatus,
  employmentDetails,
  employmentFocus,
  salaryDetails,
  educationDetails,
} from '../pages';

import dateReleasedFromActiveDuty from '../pages/dateReleasedFromActiveDuty';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10297',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10297,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-10297) is in progress.',
    //   expired: 'Your saved education benefits application (22-10297) has expired. If you want to apply for education benefits, please start a new application.',
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
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
      },
    },
    identificationChapter: {
      title: 'Veteran’s information',
      pages: {
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
        dateReleasedFromActiveDuty: {
          path: 'date-released-from-active-duty',
          title: 'Date released from active duty',
          uiSchema: dateReleasedFromActiveDuty.uiSchema,
          schema: dateReleasedFromActiveDuty.schema,
        },
      },
    },
    backgroundInformationChapter: {
      title: 'Background information',
      pages: {
        employmentStatus: {
          path: 'employment-status',
          title: 'Your employment',
          uiSchema: employmentStatus.uiSchema,
          schema: employmentStatus.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData.isEmployed === false) {
              goPath('/education-details');
            } else {
              goPath('/employment-details');
            }
          },
        },
        employmentDetails: {
          path: 'employment-details',
          title: 'Your technology industry involvement',
          uiSchema: employmentDetails.uiSchema,
          schema: employmentDetails.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData.isInTechnologyIndustry === false) {
              goPath('/salary-details');
            } else {
              goPath('/employment-focus');
            }
          },
        },
        employmentFocus: {
          path: 'employment-focus',
          title: 'Your main area of focus',
          uiSchema: employmentFocus.uiSchema,
          schema: employmentFocus.schema,
        },
        salaryDetails: {
          path: 'salary-details',
          title: 'Your current annual salary',
          uiSchema: salaryDetails.uiSchema,
          schema: salaryDetails.schema,
          onNavBack: ({ formData, goPath, goPreviousPath }) => {
            if (formData.isInTechnologyIndustry === false) {
              goPath('/employment-details');
            } else {
              goPreviousPath();
            }
          },
        },
        educationDetails: {
          path: 'education-details',
          title: 'Your education',
          uiSchema: educationDetails.uiSchema,
          schema: educationDetails.schema,
          onNavBack: ({ formData, goPath, goPreviousPath }) => {
            if (formData.isEmployed === false) {
              goPath('/employment-status');
            } else {
              goPreviousPath();
            }
          },
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
