import React from 'react';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

// application root imports
import { scrollAndFocusTarget } from 'applications/_mock-form-ae-design-patterns/utils/focus';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';
import Confirmation from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';
import { taskCompletePagePattern2 } from 'applications/_mock-form-ae-design-patterns/shared/config/taskCompletePage';
import { VIEW_FIELD_SCHEMA } from 'applications/_mock-form-ae-design-patterns/utils/constants';

// task specific imports
import { ContactInformationInfoSection } from '../components/ContactInfo';
import VeteranProfileInformation from '../components/VeteranProfileInformation';
import IntroductionPage from '../containers/IntroductionPage';
import { definitions } from './schemaImports';
import profileContactInfo from './profileContactInfo';
import ReviewPage from '../../pages/ReviewPage';

const formConfig = {
  rootUrl: '/mock-form-ae-design-patterns',
  urlPrefix: '/2/task-gray/',
  // submitUrl: `${environment.API_URL}/v0/coe/submit_coe_claim`,
  // transformForSubmit: customCOEsubmit,
  trackingPrefix: 'task-gray',
  customText: {
    appAction: 'your COE request',
    appSavedSuccessfullyMessage: 'Your request has been saved.',
    appType: 'form',
    continueAppButtonText: 'Continue your request',
    finishAppLaterMessage: 'Finish this application later',
    startNewAppButtonText: 'Start a new request',
    reviewPageTitle: 'Review your request',
  },
  introduction: IntroductionPage,
  confirmation: Confirmation,
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
      },
    },
    reviewApp: {
      title: 'Review Application',
      reviewTitle: 'Review Application',
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
        taskCompletePagePattern2,
      },
    },
  },
};

export default formConfig;
