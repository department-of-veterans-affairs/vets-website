// Example of an imported schema:
// import fullSchema from '../26-1880-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/26-1880-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import fullSchema from '../26-1880-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import manifest from '../manifest.json';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

// chapter schema imports
import {
  applicantInformation,
  applicantContactInfo,
  communicationPreferences,
} from './chapters/applicant';

import {
  serviceStatus,
  serviceHistory,
  serviceDecoration,
} from './chapters/service';

import { loanScreener, loanIntent, loanHistory } from './chapters/loans';

import { docScreener, fileUpload } from './chapters/documents';

// TODO: WHen schema is migrated to vets-json-schema, remove common definitions from form schema and get them
// from common definitions instead

const {
  fullName,
  ssn,
  date,
  dateRange,
  usaPhone,
  profileAddress,
  usAddress,
  email,
} = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '26-1880-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '26-1880',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Certificate of Eligibility VA Form 26-1880',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
    profileAddress,
    usAddress,
    email,
    ...fullSchema.definitions,
  },
  chapters: {
    applicantInformationChapter: {
      title: 'Your Information',
      pages: {
        applicantInformationSummary: {
          path: 'applicant-information-summary',
          title: 'Your personal informaton on file',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
        },
        applicantContactInformation: {
          path: 'applicant-contact-information',
          title: 'Your contact information',
          uiSchema: applicantContactInfo.uiSchema,
          schema: applicantContactInfo.schema,
        },
        applicantCommunicationPreferences: {
          path: 'applicant-communication-preference',
          title: 'Your communication preference',
          uiSchema: communicationPreferences.uiSchema,
          schema: communicationPreferences.schema,
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Your service history',
      pages: {
        serviceStatus: {
          path: 'service-status',
          title: 'Service status',
          uiSchema: serviceStatus.uiSchema,
          schema: serviceStatus.schema,
        },
        serviceHistory: {
          path: 'service-history',
          title: 'Service history',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
        serviceDecoration: {
          path: 'service-decoration',
          title: 'Service Decoration',
          uiSchema: serviceDecoration.uiSchema,
          schema: serviceDecoration.schema,
        },
      },
    },
    loansChapter: {
      title: 'Your VA loan history',
      pages: {
        loanScreener: {
          path: 'exising-loan-screener',
          title: 'Existing loans',
          uiSchema: loanScreener.uiSchema,
          schema: loanScreener.schema,
        },
        loanIntent: {
          path: 'loan-intent',
          title: 'Certificate of Eligibility intent',
          uiSchema: loanIntent.uiSchema,
          schema: loanIntent.schema,
          depends: formData => formData?.existingLoan,
        },
        loanHistory: {
          path: 'loan-history',
          title: 'VA-backed loan history',
          uiSchema: loanHistory.uiSchema,
          schema: loanHistory.schema,
          depends: formData => formData?.existingLoan,
        },
      },
    },
    documentsChapter: {
      title: 'Your supporting documents',
      pages: {
        screener: {
          path: 'document-upload-summary',
          title: 'Adding supporting documents to your application',
          uiSchema: docScreener.uiSchema,
          schema: docScreener.schema,
        },
        upload: {
          path: 'upload-supporting-documents',
          title: 'Upload documents to support your application',
          uiSchema: fileUpload.uiSchema,
          schema: fileUpload.schema,
          depends: formData => formData?.willUploadDocs,
        },
      },
    },
  },
};

export default formConfig;
