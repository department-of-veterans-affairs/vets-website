import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';

import migrations from '../migrations';
import prefillTransformer from './prefill-transformer';
import { transform } from './submit-transformer';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../components/GetFormHelp';
import ReviewDescription from '../containers/ReviewDescription';

// Pages
import veteranInformation from '../pages/veteranInformation';
import contactInfo from '../pages/contactInformation';
import contestedIssuesPage from '../pages/contestedIssues';
import informalConference from '../pages/informalConference';

import { errorMessages } from '../constants';
// import initialData from '../tests/schema/initialData';

const formConfig = {
  urlPrefix: '/',
  // submitUrl: `${environment.API_URL}/v0/higher_level_review/submit`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'hlr-0996-',
  downtime: {
    requiredForPrefill: true,
    // double check these required services
    dependencies: [services.vet360],
  },

  formId: VA_FORM_IDS.FORM_20_0996,
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
      title: 'Contested issues',
      pages: {
        contestedIssues: {
          title: ' ',
          path: 'contested-issues',
          uiSchema: contestedIssuesPage.uiSchema,
          schema: contestedIssuesPage.schema,
          // initialData,
        },
      },
    },
    informalConference: {
      title: 'Request an informal conference',
      pages: {
        requestConference: {
          path: 'request-informal-conference',
          title: 'Request an informal conference',
          uiSchema: informalConference.uiSchema,
          schema: informalConference.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
