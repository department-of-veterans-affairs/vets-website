/* eslint-disable no-console */
import environment from 'platform/utilities/environment';
import fullSchema from '../10-10D-schema.json';

import manifest from '../manifest.json';
import prefillTransformer from './prefill-transformer';
import { transformForSubmit } from './submit-transformer';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Pages
import sponsorInformation from '../pages/sponsor/sponsorInformation';
import sponsorAddress from '../pages/sponsor/sponsorAddress';
import sponsorDates from '../pages/sponsor/sponsorDates';

import applicantInformation from '../pages/applicants/applicantInformation';
import applicantAddress from '../pages/applicants/applicantAddress';

const {
  fullName,
  ssn,
  date,
  gender,
  phone,
  email,
  address,
  vetRelationship,
  centralMailVaFile,
} = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/forms_api/v1/submit`,
  // submit: () => Promise.resolve({}),
  trackingPrefix: '1010d-',
  transformForSubmit,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-10D',
  saveInProgress: {
    messages: {
      inProgress: 'Your 10-10D application is in progress.',
      expired: 'Your saved 10-10D application has expired.',
      saved: 'Your 10-10D application has been saved.',
    },
  },
  savedFormMessages: {
    notFound: 'Please start over to fill out the 10-10D application.',
    noAuth: 'Please sign in again to continue your 10-10D application.',
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  title: 'Application for CHAMPVA Benefits',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    gender,
    phone,
    email,
    address,
    vetRelationship,
    centralMailVaFile,
  },
  chapters: {
    sponsorChapter: {
      title: 'Sponsor Information',
      pages: {
        sponsorInformation: {
          path: 'sponsor/information',
          title: 'Sponsor Information',
          uiSchema: sponsorInformation.uiSchema,
          schema: sponsorInformation.schema,
        },
        sponsorAddress: {
          path: 'sponsor/address',
          title: 'Sponsor Address',
          uiSchema: sponsorAddress.uiSchema,
          schema: sponsorAddress.schema,
        },
        sponsorDates: {
          path: 'sponsor/dates',
          title: 'Sponsor Dates',
          uiSchema: sponsorDates.uiSchema,
          schema: sponsorDates.schema,
        },
      },
    },
    applicantChapter: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant',
          title: 'Applicant Information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
        },
        applicantAddress: {
          path: 'applicant/:index',
          title: 'Applicant Address',
          showPagePerItem: true,
          arrayPath: 'applicants',
          uiSchema: applicantAddress.uiSchema,
          schema: applicantAddress.schema,
        },
      },
    },
  },
};

export default formConfig;
