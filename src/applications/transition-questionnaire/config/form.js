// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// Example of an imported schema:
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/NA-schema.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from '../NA-schema.json';

// import fullSchema from 'vets-json-schema/dist/NA-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

// pages
import directDeposit from '../pages/directDeposit';
import serviceHistory from '../pages/serviceHistory';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'transition-questionnaire-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'NA',
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
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    applicantInformationChapter: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant Information',
          uiSchema: {
            fullName: fullNameUI,
            ssn: ssnUI,
          },
          schema: {
            type: 'object',
            required: ['fullName'],
            properties: {
              fullName,
              ssn,
            },
          },
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Service History',
      pages: {
        serviceHistory: {
          path: 'service-history',
          title: 'Service History',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
      },
    },
    additionalInformationChapter: {
      title: 'Additional Information',
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            address: address.uiSchema('Mailing address'),
            email: {
              'ui:title': 'Primary email',
            },
            altEmail: {
              'ui:title': 'Secondary email',
            },
            phoneNumber: phoneUI('Daytime phone'),
          },
          schema: {
            type: 'object',
            properties: {
              address: address.schema(fullSchema, true),
              email: {
                type: 'string',
                format: 'email',
              },
              altEmail: {
                type: 'string',
                format: 'email',
              },
              phoneNumber: usaPhone,
            },
          },
        },
        directDeposit: {
          path: 'direct-deposit',
          title: 'Direct Deposit',
          uiSchema: directDeposit.uiSchema,
          schema: directDeposit.schema,
        },
      },
    },
  },
};

export default formConfig;
