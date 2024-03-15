import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberNoHintUI,
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
      fullNamePath: 'fullName',
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
      title: 'Name and date of birth',
      pages: {
        page1: {
          path: 'veteran-information',
          title: 'Name and date of birth',
          uiSchema: {
            ...titleUI(
              'Name and date of birth',
              'We use this information to verify other details.',
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
              `Identification information`,
              `You must enter either a Social Security number of VA File number.`,
            ),
            ssn: ssnOrVaFileNumberNoHintUI(),
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
            ...titleUI(
              'Physical Address',
              'This is your current location, outside the United States.',
            ),
            physicalAddress: addressUI({
              labels: {
                street2: 'Apartment or unit number',
              },
              omit: ['street3', 'isMilitary'],
              required: {
                state: () => true,
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['physicalAddress'],
            properties: {
              titleSchema,
              physicalAddress: addressSchema({
                omit: ['street3', 'isMilitary'],
              }),
            },
          },
        },
        page4: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: {
            ...titleUI(
              'Mailing address',
              "We'll send any important information about your application to this address.",
            ),
            mailingAddress: addressUI({
              labels: {
                street2: 'Apartment or unit number',
              },
              omit: ['street3', 'isMilitary'],
              required: {
                state: () => true,
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['mailingAddress'],
            properties: {
              titleSchema,
              mailingAddress: addressSchema({
                omit: ['street3', 'isMilitary'],
              }),
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
