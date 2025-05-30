import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';
// import path from 'path-browserify';
import fullSchema from '../22-1919-schema.json';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import directDeposit from '../pages/directDeposit';

import {
  certifyingOfficials,
  aboutYourInstitution,
  institutionDetails,
  proprietaryProfit,
} from '../pages';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'Edu-1919-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-1919',
  useCustomScrollAndFocus: true,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-1919) is in progress.',
    //   expired: 'Your saved education benefits application (22-1919) has expired. If you want to apply for education benefits, please start a new application.',
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
  title: 'Conflicting interests certification for proprietary schools',
  subTitle: 'VA Form 22-1919',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    institutionDetailsChapter: {
      title: 'Institution details',
      pages: {
        certifyingOfficial: {
          path: 'applicant-information',
          title: 'Your name and role',
          uiSchema: certifyingOfficials.uiSchema,
          schema: certifyingOfficials.schema,
        },
        aboutYourInstitution: {
          path: 'about-your-institution',
          title: 'About your institution',
          uiSchema: aboutYourInstitution.uiSchema,
          schema: aboutYourInstitution.schema,
        },
        institutionDetails: {
          path: 'institution-information',
          title: 'Institution information',
          uiSchema: institutionDetails.uiSchema,
          schema: institutionDetails.schema,
          depends: formData => {
            return formData?.aboutYourInstitution === true;
          },
        },
      },
    },
    proprietaryProfitChapter: {
      title: 'Proprietary profit schools only',
      pages: {
        proprietaryProfit: {
          path: 'proprietary-profit',
          title: "Confirm your institution's classification",
          uiSchema: proprietaryProfit.uiSchema,
          schema: proprietaryProfit.schema,
        },
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
};

export default formConfig;
