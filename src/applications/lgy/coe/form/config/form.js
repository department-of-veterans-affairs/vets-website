import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { GetFormHelp } from '../components/GetFormHelp';
import manifest from '../manifest.json';
import { customCOEsubmit } from './helpers';
import { definitions } from './schemaImports';

// chapter schema imports
import { applicantInformation } from './chapters/applicant';

import {
  additionalInformation,
  mailingAddress,
} from './chapters/contact-information';

import { serviceStatus, serviceHistory } from './chapters/service';

import { loanScreener, loanHistory } from './chapters/loans';

import { fileUpload } from './chapters/documents';

// TODO: When schema is migrated to vets-json-schema, remove common
// definitions from form schema and get them from common definitions instead

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/coe/submit_coe_claim`,
  transformForSubmit: customCOEsubmit,
  trackingPrefix: '26-1880-',
  customText: {
    appAction: 'your COE request',
    appSavedSuccessfullyMessage: 'Your request has been saved.',
    appType: 'request',
    continueAppButtonText: 'Continue your request',
    finishAppLaterMessage: 'Finish this request later',
    startNewAppButtonText: 'Start a new request',
    reviewPageTitle: 'Review your request',
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '26-1880',
  version: 0,
  prefillEnabled: true,
  footerContent: FormFooter,
  preSubmitInfo,
  getHelp: GetFormHelp,
  savedFormMessages: {
    notFound: 'Start over to request benefits.',
    noAuth: 'Sign in again to continue your request for benefits.',
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your Certificate of Eligibility form (26-1880) is in progress.',
      expired:
        'Your saved Certificate of Eligibility form (26-1880) has expired. If you want to request Chapter 31 benefits, start a new request.',
      saved: 'Your Certificate of Eligibility request has been saved.',
    },
  },
  title: 'Request a VA home loan Certificate of Eligibility (COE)',
  subTitle: 'VA Form 26-1880',
  defaultDefinitions: definitions,
  chapters: {
    applicantInformationChapter: {
      title: 'Your personal information',
      pages: {
        applicantInformationSummary: {
          path: 'applicant-information',
          title: 'Your personal information on file',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: mailingAddress.title,
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
          updateFormData: mailingAddress.updateFormData,
        },
        additionalInformation: {
          path: 'additional-contact-information',
          title: additionalInformation.title,
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
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
      },
    },
    loansChapter: {
      title: 'Your VA loan history',
      pages: {
        loanScreener: {
          path: 'existing-loan-screener',
          title: 'Existing loans',
          uiSchema: loanScreener.uiSchema,
          schema: loanScreener.schema,
        },
        loanHistory: {
          path: 'loan-history',
          title: 'VA-backed loan history',
          uiSchema: loanHistory.uiSchema,
          schema: loanHistory.schema,
          depends: formData => formData?.vaLoanIndicator,
        },
      },
    },
    documentsChapter: {
      title: 'Your supporting documents',
      pages: {
        upload: {
          path: 'upload-supporting-documents',
          title: 'Upload your documents',
          uiSchema: fileUpload.uiSchema,
          schema: fileUpload.schema,
        },
      },
    },
  },
};

export default formConfig;
