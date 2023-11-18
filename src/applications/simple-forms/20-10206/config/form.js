import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import manifest from '../manifest.json';
// we're NOT using JSON Schema for this form, so we don't need to import it

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import preparerTypePg from '../pages/preparerType';
import persInfoPg from '../pages/personalInfo';
import citizenIdInfoPg from '../pages/citizenIdentificationInfo';
import nonCitizenIdInfoPg from '../pages/nonCitizenIdentificationInfo';
import addressPg from '../pages/address';
import phoneEmailPg from '../pages/phoneEmail';
import { PREPARER_TYPES } from './constants';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/test-data.json';

const mockData = testData.data;

/** @type {FormConfig} */
const formConfig = {
  dev: {
    showNavLinks: !window.Cypress,
  },
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'pa-10206',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '20-10206',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your personal records application (20-10206) is in progress.',
    //   expired: 'Your saved personal records application (20-10206) has expired. If you want to apply for personal records, please start a new application.',
    //   saved: 'Your personal records application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for personal records.',
    noAuth:
      'Please sign in again to continue your application for personal records.',
  },
  title: 'Request personal records',
  defaultDefinitions: {},
  v3SegmentedProgressBar: true,
  chapters: {
    preparerTypeChapter: {
      title: 'Your identity',
      pages: {
        preparerTypePage: {
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData:
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          path: 'preparer-type',
          title: 'Preparer type',
          uiSchema: preparerTypePg.uiSchema,
          schema: preparerTypePg.schema,
          pageClass: 'preparer-type-page',
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        personalInfoPage: {
          path: 'personal-information',
          title: 'Name and date of birth',
          uiSchema: persInfoPg.uiSchema,
          schema: persInfoPg.schema,
          pageClass: 'personal-information',
        },
        citizenIdentificationInfoPage: {
          depends: {
            preparerType: PREPARER_TYPES.CITIZEN,
          },
          path: 'citizen-identification-information',
          title: 'Identification information',
          uiSchema: citizenIdInfoPg.uiSchema,
          schema: citizenIdInfoPg.schema,
          pageClass: 'citizen-identification-information',
        },
        nonCitizenIdentificationInfoPage: {
          depends: {
            preparerType: PREPARER_TYPES.NON_CITIZEN,
          },
          path: 'non-citizen-identification-information',
          title: 'Identification information',
          uiSchema: nonCitizenIdInfoPg.uiSchema,
          schema: nonCitizenIdInfoPg.schema,
          pageClass: 'citizen-identification-information',
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        addressPage: {
          path: 'contact-information',
          title: 'Mailing address',
          uiSchema: addressPg.uiSchema,
          schema: addressPg.schema,
          pageClass: 'address',
        },
        phoneEmailPage: {
          path: 'phone-email',
          title: 'Phone and email address',
          uiSchema: phoneEmailPg.uiSchema,
          schema: phoneEmailPg.schema,
          pageClass: 'phone-email',
        },
      },
    },
  },
};

export default formConfig;
