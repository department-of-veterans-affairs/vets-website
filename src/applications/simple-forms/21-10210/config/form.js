// import fullSchema from 'vets-json-schema/dist/21-10210-schema.json';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
// import { uiSchema as addressUiSchema } from 'src/platform/forms/definitions/address';
import get from 'platform/utilities/data/get';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'lay-witness-10210-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-10210',
  saveInProgress: {
    messages: {
      inProgress: 'Your claims application (21-10210) is in progress.',
      expired:
        'Your saved claims application (21-10210) has expired. If you want to apply for claims, please start a new application.',
      saved: 'Your claims application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    // notFound: 'Please start over to apply for claims.',
    // noAuth: 'Please sign in again to continue your application for claims.',
  },
  title: '21-10210 Lay/Witness Statement',
  defaultDefinitions: {},
  chapters: {
    statementInformation: {
      title: 'Who is submitting this statement?',
      pages: {
        statementInformation1: {
          path: 'statement-information',
          title: 'Statement information',
          uiSchema: {
            claimOwnership: {
              'ui:title':
                "Are you submitting this statement to support your claim or someone else's claim?",
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  self: 'My own claim',
                  'third-party': 'Someone else’s claim',
                },
              },
            },
            claimantType: {
              'ui:widget': 'radio',
              'ui:options': {
                hideIf: formData => formData.claimOwnership === undefined,
                updateSchema: (formData, schema, uiSchema) => {
                  const { claimOwnership } = formData;
                  let title;
                  switch (claimOwnership) {
                    case 'self':
                      title = 'Which of these descriptions best describes you?';
                      uiSchema['ui:options'].labels = {
                        veteran: 'I’m a Veteran',
                        'non-veteran': 'I’m a non-Veteran claimant',
                      };
                      break;
                    case 'third-party':
                      title =
                        'Which of these individuals are you submitting a statement for?';
                      uiSchema['ui:options'].labels = {
                        veteran: 'A Veteran',
                        'non-veteran': 'A non-Veteran claimant',
                      };
                      break;
                    default:
                      title = 'Claimant type:';
                  }

                  return {
                    title,
                    uiSchema,
                  };
                },
                labels: {
                  veteran: 'Veteran',
                  'non-veteran': 'Non-Veteran',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['claimOwnership', 'claimantType'],
            properties: {
              claimOwnership: {
                type: 'string',
                enum: ['self', 'third-party'],
              },
              claimantType: {
                type: 'string',
                enum: ['veteran', 'non-veteran'],
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
