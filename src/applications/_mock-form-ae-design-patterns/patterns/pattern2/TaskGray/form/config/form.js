import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { GetFormHelp } from '../components/GetFormHelp';
import manifest from '../manifest.json';
import { definitions } from './schemaImports';
import profileContactInfo from './profileContactInfo';
import VeteranProfileInformation from '../components/VeteranProfileInformation';

// chapter schema imports
// import { applicantInformation } from './chapters/applicant';
import { VIEW_FIELD_SCHEMA } from '../../../../../utils/constants';

import { taskCompletePagePattern2 } from '../../../../../shared/config/taskCompletePage';

// import { serviceHistory } from './chapters/service';

// import { loanScreener, loanHistory } from './chapters/loans';

// import { fileUpload } from './chapters/documents';

// TODO: When schema is migrated to vets-json-schema, remove common
// definitions from form schema and get them from common definitions instead

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/2/task-gray/',
  // submitUrl: `${environment.API_URL}/v0/coe/submit_coe_claim`,
  // transformForSubmit: customCOEsubmit,
  trackingPrefix: 'task-gray',
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
  formId: VA_FORM_IDS.FORM_26_1880,
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
        profileInformation: {
          path: 'applicant-information',
          title: 'Veteran\u2019s personal information',
          CustomPage: VeteranProfileInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: VIEW_FIELD_SCHEMA,
        },
        // applicantInformationSummary: {
        //   path: 'applicant-information',
        //   title: 'Your personal information on file',
        //   uiSchema: applicantInformation.uiSchema,
        //   schema: applicantInformation.schema,
        // },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo3',
          contactPath: 'veteran-information',
          contactInfoRequiredKeys: ['mailingAddress'],
          included: ['mailingAddress'],
        }),
        // mailingAddress: {
        //   path: 'mailing-address',
        //   title: mailingAddress.title,
        //   uiSchema: mailingAddress.uiSchema,
        //   schema: mailingAddress.schema,
        //   updateFormData: mailingAddress.updateFormData,
        // },
        // additionalInformation: {
        //   path: 'additional-contact-information',
        //   title: additionalInformation.title,
        //   uiSchema: additionalInformation.uiSchema,
        //   schema: additionalInformation.schema,
        // },
      },
    },
    serviceHistoryChapter: {
      title: 'Your service history',
      pages: {
        // serviceStatus: {
        //   path: 'service-status',
        //   title: 'Service status',
        //   uiSchema: serviceStatus.uiSchema,
        //   schema: serviceStatus.schema,
        // },
        serviceHistory: {
          path: 'service-history',
          title: 'Service history',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
        taskCompletePagePattern2,
      },
    },
  },
};

export default formConfig;
