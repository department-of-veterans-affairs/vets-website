// Example of an imported schema:
import fullSchema from '../20-0996-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/20-0996-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
// import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../content/GetFormHelp';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Pages
import veteranDetailsDescription from '../pages/confirmVeteranDetails';

import contactInfo from '../pages/contactInformation';
import contestedIssues from '../pages/contestedIssues';

import { contestedIssuesNotesStart } from '../content/contestedIssues';

// TODO: Mock data - remove once API is connected
import initialData from '../tests/schema/initialData';
import { errorMessages } from '../constants';

const {
  address,
  phone,
  date,
  effectiveDates,
  ratedDisabilities,
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
  savedFormMessages: {
    notFound: errorMessages.savedFormNotFound,
    noAuth: errorMessages.savedFormNoAuth,
  },
  title: 'Request a Higher-Level Review',
  subTitle: 'VA Form 20-0996',
  defaultDefinitions: {
    address,
    phone,
    date,
    effectiveDates,
    veteranDetailsDescription,
    ratedDisabilities,
  },
  chapters: {
    veteranDetails: {
      title: 'Veteran details',
      pages: {
        confirmVeteranDetails: {
          title: 'Confirm Veteran details',
          path: 'veteran-details',
          uiSchema: {
            'ui:description': veteranDetailsDescription,
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
          uiSchema: contestedIssues.uiSchema,
          schema: contestedIssues.schema,
          initialData,
        },
        contestedIssuesNotesStart: {
          title: ' ',
          path: 'contested-issues/start',
          uiSchema: {
            'ui:description': contestedIssuesNotesStart,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
        // contestedIssueNote: {},
      },
    },
    requestInformalConference: {
      title: 'Informal conference',
      pages: {
        requestConference: {
          path: 'request-informal-conference',
          title: 'Request an informal conference',
          uiSchema: {
            conference: {
              'ui:title': 'Would you like to request an Informal Conference?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            properties: {
              conference: {
                type: 'boolean',
                default: true,
              },
            },
          },
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
