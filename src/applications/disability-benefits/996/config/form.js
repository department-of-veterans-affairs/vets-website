import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';

import migrations from '../migrations';
import prefillTransformer from './prefill-transformer';
import { transform } from './submit-transformer';
import submitForm from './submitForm';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../content/GetFormHelp';
import ReviewDescription from '../components/ReviewDescription';

// Pages
import veteranInformation from '../pages/veteranInformation';
import contactInfo from '../pages/contactInformation';
import contestedIssuesPage from '../pages/contestedIssues';
import informalConference from '../pages/informalConference';
import informalConferenceRep from '../pages/informalConferenceRep';
import informalConferenceTimes from '../pages/informalConferenceTimes';
import sameOffice from '../pages/sameOffice';

import { errorMessages, WIZARD_STATUS } from '../constants';
// import initialData from '../tests/schema/initialData';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/higher_level_reviews`,
  submit: submitForm,
  trackingPrefix: 'decision-reviews-va20-0996-',
  downtime: {
    requiredForPrefill: true,
    dependencies: [
      services.vaProfile,
      services.bgs,
      services.mvi,
      services.appeals,
    ],
  },

  formId: VA_FORM_IDS.FORM_20_0996,
  wizardStorageKey: WIZARD_STATUS,
  saveInProgress: {
    messages: {
      inProgress:
        'Your Higher-Level Review application (20-0996) is in progress.',
      expired:
        'Your saved Higher-Level Review application (20-0996) has expired. If you want to apply for Higher-Level Review, please start a new application.',
      saved: 'Your Higher-Level Review application has been saved.',
    },
    // return restart destination url
    restartFormCallback: () => '/', // introduction page
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,

  version: migrations.length,
  migrations,
  prefillTransformer,
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  transformForSubmit: transform,

  // beforeLoad: props => { console.log('form config before load', props); },
  // onFormLoaded: ({ formData, savedForms, returnUrl, formConfig, router }) => {
  //   console.log('form loaded', formData, savedForms, returnUrl, formConfig, router);
  // },

  savedFormMessages: {
    notFound: errorMessages.savedFormNotFound,
    noAuth: errorMessages.savedFormNoAuth,
  },

  title: 'Request a Higher-Level Review',
  subTitle: 'Equal to VA Form 20-0996',
  defaultDefinitions: {},
  preSubmitInfo,
  chapters: {
    infoPages: {
      title: 'Veteran information',
      reviewDescription: ReviewDescription,
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        confirmContactInformation: {
          title: 'Contact information',
          path: 'contact-information',
          uiSchema: contactInfo.uiSchema,
          schema: contactInfo.schema,
        },
      },
    },
    contestedIssues: {
      title: 'Issues eligible for review',
      pages: {
        contestedIssues: {
          title: ' ',
          path: 'eligible-issues',
          uiSchema: contestedIssuesPage.uiSchema,
          schema: contestedIssuesPage.schema,
          // initialData,
        },
      },
    },
    sameOffice: {
      title: 'Office of review',
      pages: {
        sameOffice: {
          title: ' ',
          path: 'office-of-review',
          uiSchema: sameOffice.uiSchema,
          schema: sameOffice.schema,
        },
      },
    },
    informalConference: {
      title: 'Request an informal conference',
      pages: {
        requestConference: {
          path: 'informal-conference',
          title: 'Request an informal conference',
          uiSchema: informalConference.uiSchema,
          schema: informalConference.schema,
        },
        representativeInfo: {
          path: 'informal-conference/representative-information',
          title: 'Representative’s information',
          depends: formData => formData?.informalConference === 'rep',
          uiSchema: informalConferenceRep.uiSchema,
          schema: informalConferenceRep.schema,
        },
        availability: {
          path: 'informal-conference/availability',
          title: 'Scheduling availability',
          depends: formData => formData?.informalConference !== 'no',
          uiSchema: informalConferenceTimes.uiSchema,
          schema: informalConferenceTimes.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
