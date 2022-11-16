/* eslint-disable no-console */
import fullSchema from '../10-10D-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Pages
import sponsorInformation from '../pages/sponsor/sponsorInformation';
import sponsorAddress from '../pages/sponsor/sponsorAddress';
import sponsorDates from '../pages/sponsor/sponsorDates';

import applicantInformation from '../pages/applicantInformation';

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
  // submitUrl: '/v0/api',
  submit: (form, formData) => {
    console.log(form);
    console.log(formData);
  },
  trackingPrefix: '1010d-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-10D',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {},
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
    applicantInformationChapter: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant Information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
