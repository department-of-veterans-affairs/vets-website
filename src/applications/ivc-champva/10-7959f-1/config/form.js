import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  addressUI,
  addressSchema,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-7959f-1-FMP-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
    },
  },
  formId: '10-7959F-1',
  saveInProgress: {
    messages: {
      inProgress: 'Your CHAMPVA application (10-7959F-1) is in progress.',
      expired:
        'Your saved CHAMPVA benefits application (10-7959F-1) has expired. If you want to apply for Foriegn Medical Program benefits, please start a new application.',
      saved: 'Your CHAMPVA benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for CHAMPVA benefits.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA benefits.',
  },
  title: 'Foreign Medical Program (FMP) Registration Form',
  defaultDefinitions: {},
  chapters: {
    applicantInformationChapter: {
      title: "Veteran's Information",
      pages: {
        page1: {
          path: 'veteran-information',
          title: 'Veteran Personal Information',
          uiSchema: {
            ...titleUI(
              "Veteran's personal information",
              'We use this information to contact you and verify other details.',
            ),
            fullName: fullNameUI(),
            veteranDOB: dateOfBirthUI(),
          },
          schema: {
            type: 'object',
            required: ['fullName', 'veteranDOB'],
            properties: {
              titleSchema,
              fullName: fullNameSchema,
              veteranDOB: dateOfBirthSchema,
            },
          },
        },
        page2: {
          path: 'veteran-information/ssn',
          title: 'Veteran SSN and VA file number',
          uiSchema: {
            ...titleUI(
              `Veteran's identification information`,
              `You must enter either a Social Security number of VA File number`,
            ),
            ssn: ssnOrVaFileNumberUI(),
          },
          schema: {
            type: 'object',
            required: ['ssn'],
            properties: {
              titleSchema,
              ssn: ssnOrVaFileNumberSchema,
            },
          },
        },
        page3: {
          path: 'physical-address',
          title: 'Physical Address',
          uiSchema: {
            ...titleUI("Veteran's home address (residence)"),
            physicalAddress: addressUI(),
          },
          schema: {
            type: 'object',
            required: ['physicalAddress'],
            properties: {
              titleSchema,
              physicalAddress: addressSchema(),
            },
          },
        },
        page4: {
          path: 'mailing-address',
          title: "Veteran's mailing address",
          uiSchema: {
            ...titleUI("Veteran's mailing address"),
            mailingAddress: addressUI(),
          },
          schema: {
            type: 'object',
            required: 'mailingAddress',
            properties: {
              titleSchema,
              mailingAddress: addressSchema(),
            },
          },
        },
        page5: {
          path: 'contact-info',
          title: "Veteran's contact information",
          uiSchema: {
            ...titleUI("Veteran's contact information"),
            phoneNumber: phoneUI(),
            emailAddress: emailUI(),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              phoneNumber: phoneSchema,
              emailAddress: emailSchema,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
