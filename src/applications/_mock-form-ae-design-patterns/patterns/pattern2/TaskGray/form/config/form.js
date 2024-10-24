import React from 'react';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { scrollAndFocusTarget } from 'applications/_mock-form-ae-design-patterns/utils/focus';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { GetFormHelp } from '../components/GetFormHelp';
import manifest from '../manifest.json';
import { definitions } from './schemaImports';
import profileContactInfo from './profileContactInfo';
import { ContactInformationInfoSection } from '../components/ContactInfo';
import VeteranProfileInformation from '../components/VeteranProfileInformation';
import ReviewPage from '../../pages/ReviewPage';
// chapter schema imports
// import { applicantInformation } from './chapters/applicant';
import { VIEW_FIELD_SCHEMA } from '../../../../../utils/constants';
// import { taskCompletePage } from '../../../../../shared/config/taskCompletePage';

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
      reviewTitle: 'Contact information',
      pages: {
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo3',
          contactPath: 'veteran-information',
          contactInfoRequiredKeys: ['mailingAddress'],
          included: ['mailingAddress'],
          review: props => ({
            'Contact Information': (() => {
              return <ContactInformationInfoSection {...props} />;
            })(),
          }),
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
    reviewApp: {
      title: 'Review Application',
      pages: {
        reviewAndSubmit: {
          hideNavButtons: true,
          title: 'Review and submit',
          path: 'review-then-submit',
          CustomPage: ReviewPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: {
            definitions: {},
            type: 'object',
            properties: {},
          },
          scrollAndFocusTarget,
        },
      },
    },
  },
};

export default formConfig;
