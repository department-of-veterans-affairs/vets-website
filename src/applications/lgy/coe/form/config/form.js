import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { GetFormHelp } from '../components/GetFormHelp';
import manifest from '../manifest.json';
import { customCOEsubmit } from './helpers';
import { definitions } from './schemaImports';

// chapter schema imports
import {
  applicantInformation,
  personalInformation,
} from './chapters/applicant';

import {
  additionalInformation,
  mailingAddress,
} from './chapters/contact-information';

import { serviceStatus, serviceHistory } from './chapters/service';

import { loanScreener, loanHistory } from './chapters/loans';

import { fileUpload } from './chapters/documents';

import serviceStatus2 from '../pages/serviceStatus2';
// import disabilitySeparation from '../pages/disabilitySeparation';

// TODO: When schema is migrated to vets-json-schema, remove common
// definitions from form schema and get them from common definitions instead

const customConfig = {
  // Page identification
  contactInfoPageKey: 'confirmContactInformation',
  contactPath: 'contact-information',
  // Content customization
  content: getContent('application'), // or custom content object
  // Data keys - customize where contact info is stored in form data
  wrapperKey: 'veteran',
  emailKey: 'email',
  homePhoneKey: 'homePhone',
  mobilePhoneKey: 'mobilePhone',
  addressKey: 'mailingAddress',
  // Which fields to include
  included: ['email', 'mobilePhone', 'mailingAddress'], // Excludes home phone
  // Required fields - prevents form continuation if missing
  contactInfoRequiredKeys: ['email', 'mobilePhone', 'mailingAddress'],
  // UI options
  contactSectionHeadingLevel: 'h4', // Default: 'h3' (main page) or 'h4' (review)
  editContactInfoHeadingLevel: 'h3', // Default: 'h3'
  disableMockContactInfo: false, // Disable mock data in local development

  prefillPatternEnabled: true, // Enable prefill pattern features
};

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
  useCustomScrollAndFocus: true,
  defaultDefinitions: definitions,
  chapters: {
    applicantInformationChapter: {
      title: data => {
        return data.formData['view:coeFormRebuildCveteam']
          ? 'Your information'
          : 'Your personal information on file';
      },
      pages: {
        yourInformation: personalInformation,
        ...profileContactInfoPages({
          depends: formData => formData['view:coeFormRebuildCveteam'],
          included: ['mailingAddress', 'email', 'homePhone'],
          contactInfoRequiredKeys: ['mailingAddress', 'email', 'homePhone'],
          content: {
            ...getContent('application'),
            title: 'Confirm the contact information we have on file for you',
            description: null,
          },
        }),
        applicantInformationSummary: {
          path: 'applicant-information',
          depends: formData => {
            return !formData['view:coeFormRebuildCveteam'];
          },
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
          depends: formData => {
            return !formData['view:coeFormRebuildCveteam'];
          },
          title: mailingAddress.title,
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
          updateFormData: mailingAddress.updateFormData,
        },
        additionalInformation: {
          path: 'additional-contact-information',
          depends: formData => {
            return !formData['view:coeFormRebuildCveteam'];
          },
          title: additionalInformation.title,
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
      },
    },
    serviceHistoryChapter: {
      title: data => {
        return data.formData['view:coeFormRebuildCveteam']
          ? 'Military history'
          : 'Your service history';
      },
      pages: {
        serviceStatus: {
          path: 'service-status',
          title: 'Service status',
          depends: formData => {
            return !formData['view:coeFormRebuildCveteam'];
          },
          uiSchema: serviceStatus.uiSchema,
          schema: serviceStatus.schema,
        },
        serviceStatus2: {
          path: 'service-status-2',
          title: 'Service status',
          depends: formData => {
            return formData['view:coeFormRebuildCveteam'];
          },
          uiSchema: serviceStatus2.uiSchema,
          schema: serviceStatus2.schema,
        },
        // disabilitySeparationPage: {
        //   path: 'separation',
        //   title: 'Separation',
        //   uiSchema: disabilitySeparation.uiSchema,
        //   schema: disabilitySeparation.schema,
        // },
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
