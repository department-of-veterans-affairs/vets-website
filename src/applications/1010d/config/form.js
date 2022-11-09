// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// Example of an imported schema:
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/10-10D-schema.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
// import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { set } from 'date-fns';
import fullSchema from '../10-10D-schema.json';

// import fullSchema from 'vets-json-schema/dist/10-10D-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  sponsorFullName,
  vaFileNumber,
  sponsorSsn,
  sponsorDob,
  sponsorMarriageDate,
  applicantInformation,
} = fullSchema.properties;

const { applicantSchema } = fullSchema.definitions;

// pages
import serviceHistory from '../pages/serviceHistory';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '1010d-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-10D',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (10-10D) is in progress.',
    //   expired: 'Your saved benefits application (10-10D) has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Application for CHAMPVA Benefits',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
    applicantSchema,
  },
  chapters: {
    sponsorInformationChapter: {
      title: 'Sponsor Information',
      pages: {
        sponsorInformation: {
          path: 'sponsor-information',
          title: 'Sponsor Information',
          uiSchema: {
            sponsorFullName: {
              ...fullNameUI,
            },
            sponsorSsn: ssnUI,
            sponsorAddress: set(
              'ui:validations[1], validateCenteralMailPostalCode',
              address.uiSchema('Address'),
            ),
            sponsorDob: currentOrPastDateUI('Date of Birth'),
            sponsorMarriageDate: currentOrPastDateUI('Marriage Date'),
          },
          schema: {
            type: 'object',
            required: ['sponsorFullName', 'sponsorSsn'],
            properties: {
              sponsorFullName,
              vaFileNumber,
              sponsorSsn,
              sponsorAddress: address.schema(
                fullSchema,
                true,
                'centralMailAddress',
              ),
              sponsorDob,
              sponsorMarriageDate,
            },
          },
        },
      },
    },
    applicantInformationChapter: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant Information',
          uiSchema: {
            applicantInformation: {
              items: {
                ...applicantInformation,
                fullName: {
                  ...fullNameUI,
                },
                ssn: {
                  ...ssnUI,
                },
                dob: {
                  ...currentOrPastDateUI('Date of Birth'),
                },
                address: set(
                  'ui:validations[1], validateCenteralMailPostalCode',
                  address.uiSchema('Address'),
                ),
                phont: {
                  ...usaPhone,
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['applicantInformation'],
            properties: {
              applicantInformation: {
                ...applicantInformation,
                minItems: 1,
              },
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
    // additionalInformationChapter: {
    //   title: 'Additional Information',
    //   pages: {
    //     contactInformation: {
    //       path: 'contact-information',
    //       title: 'Contact Information',
    //       uiSchema: {
    //         address: address.uiSchema('Mailing address'),
    //         email: {
    //           'ui:title': 'Primary email',
    //         },
    //         altEmail: {
    //           'ui:title': 'Secondary email',
    //         },
    //         phoneNumber: phoneUI('Daytime phone'),
    //       },
    //       schema: {
    //         type: 'object',
    //         properties: {
    //           address: address.schema(fullSchema, true),
    //           email: {
    //             type: 'string',
    //             format: 'email',
    //           },
    //           altEmail: {
    //             type: 'string',
    //             format: 'email',
    //           },
    //           phoneNumber: usaPhone,
    //         },
    //       },
    //     },
    //   },
    // },
  },
};

export default formConfig;
