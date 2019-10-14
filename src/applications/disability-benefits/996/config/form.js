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
import GetFormHelp from '../components/GetFormHelp';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Pages
import veteranDetailsDescription from '../pages/confirmVeteranDetails';
import {
  uiSchema as contactInfoUiSchema,
  schema as contactInfoSchema,
} from '../pages/contactInformation';

// TODO: Mock data - remove once API is connected
import initialData from '../tests/schema/initialData';

const { address, phone, date, effectiveDates } = fullSchema.definitions;

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
    notFound: 'Please start over to request a Higher-Level Review.',
    noAuth:
      'Please sign in again to continue your request for Higher-Level Review.',
  },
  title: 'Request a Higher-Level Review',
  subTitle: 'VA Form 20-0996',
  defaultDefinitions: {
    address,
    phone,
    date,
    effectiveDates,
    veteranDetailsDescription,
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
          path: 'veteran-details/contact-information',
          uiSchema: contactInfoUiSchema,
          schema: contactInfoSchema,
          initialData: initialData.veteran,
        },
      },
    },
    selectContestedIssues: {
      title: 'Issues selected',
      pages: {
        contestedIssues: {
          path: 'select-your-contested-issues',
          title: 'Select your contested issues',
          uiSchema: {
            myIssues: {
              'ui:title': 'My issues',
            },
          },
          schema: {
            type: 'object',
            properties: {
              myIssues: {
                type: 'string',
                enum: ['First issue', 'Second issue'],
              },
            },
          },
        },
      },
    },
    addNotes: {
      title: 'Optional Notes',
      pages: {
        addNotes: {
          path: 'add-notes',
          title: 'Add notes (optional)',
          uiSchema: {
            addNote: {
              'ui:title': 'Notes (optional)',
            },
          },
          schema: {
            type: 'object',
            properties: {
              addNote: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    requestOriginalJurisdiction: {
      title: 'Original jurisdiction',
      pages: {
        requestJurisdiction: {
          path: 'request-original-jurisdiction',
          title: 'Request original jurisdiction',
          uiSchema: {
            jurisdiction: {
              'ui:title': 'Name of Original Regional Office',
            },
          },
          schema: {
            type: 'object',
            properties: {
              jurisdiction: {
                type: 'string',
              },
            },
          },
        },
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
