// Example of an imported schema:
import fullSchema from '../20-0996-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/20-0996-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
// import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import preSubmitInfo from 'platform/forms/preSubmitInfo';

import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Pages
import veteranInformationDescription from '../pages/veteranInformation';

import contactInfo from '../pages/contactInformation';
import contestedIssuesPage from '../pages/contestedIssues';
import informalConference from '../pages/informalConference';

// TODO: Mock data - remove once API is connected
import initialData from '../tests/schema/initialData';
import { errorMessages } from '../constants';

const {
  name,
  fullName,
  address,
  phone,
  date,
  effectiveDates,
  contestedIssues,
  informalConferenceChoice,
  contactRepresentativeChoice,
  representative,
  scheduleTimes,
} = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  // submitUrl: `${environment.API_URL}/v0/higher_level_review/submit`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'hlr-0996-',

  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_20_0996,
  version: 0,
  prefillEnabled: true,
  // beforeLoad: props => { console.log('form config before load', props); },
  // onFormLoaded: ({ formData, savedForms, returnUrl, formConfig, router }) => {
  //   console.log('form loaded', formData, savedForms, returnUrl, formConfig, router);
  // },
  // verifyRequiredPrefill: true,
  // prefillTransformer: (pages, formData, metadata) => {
  //   console.log('prefill transformer', pages, formData, metadata);
  //   return { pages, formData, metadata };
  // },
  savedFormMessages: {
    notFound: errorMessages.savedFormNotFound,
    noAuth: errorMessages.savedFormNoAuth,
  },
  title: 'Request a Higher-Level Review',
  subTitle: 'Equal to VA Form 20-0996',
  defaultDefinitions: {
    name,
    fullName,
    address,
    phone,
    date,
    effectiveDates,
    contestedIssues,
    informalConferenceChoice,
    contactRepresentativeChoice,
    representative,
    scheduleTimes,
  },
  preSubmitInfo,
  chapters: {
    step1: {
      title: 'Veteran information',
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: {
            'ui:description': veteranInformationDescription,
          },
          schema: {
            type: 'object',
            properties: {},
          },
          initialData,
        },
        confirmContactInformation: {
          title: 'Contact information',
          path: 'contact-information',
          uiSchema: contactInfo.uiSchema,
          schema: contactInfo.schema,
          initialData,
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
          initialData,
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
          initialData,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
