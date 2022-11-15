import fullSchema from '../10-10D-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Chapter pages
import sponsorInformation from '../pages/sponsorInformation/sponsorInformation';
import applicantInformation from '../pages/applicantInformation';
import sponsorInformationAddress from '../pages/sponsorInformation/sponsorInformationAddress';
import sponsorInformationDates from '../pages/sponsorInformation/sponsorInformationDates';

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
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
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
    sponsorInformationChapter: {
      title: 'Sponsor Information',
      pages: {
        sponsorInformation: {
          path: 'sponsor-information/base-information',
          title: 'Sponsor Information',
          uiSchema: sponsorInformation.uiSchema,
          schema: sponsorInformation.schema,
        },
        sponsorInformationAddress: {
          path: 'sponsor-information/address',
          title: 'Sponsor Address',
          uiSchema: sponsorInformationAddress.uiSchema,
          schema: sponsorInformationAddress.schema,
        },
        sponsorInformationDates: {
          path: 'sponsor-information/dates',
          title: 'Sponsor Dates',
          uiSchema: sponsorInformationDates.uiSchema,
          schema: sponsorInformationDates.schema,
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
