// import fullSchema from 'vets-json-schema/dist/4142-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { medicalRecDescription, documentDescription, letUsKnow } from '../helpers';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: '4142',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '4142',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for private medical records release.',
    noAuth:
      'Please sign in again to continue your application for private medical records release.',
  },
  title: '4142 Private Medical Record Release Form',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Apply for disability increase',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {
            uploadRecs: {
              'ui:description':
                'Do you want to upload your private medical records?',
              'ui:title': documentDescription,
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes',
                  no: 'No, my doctor has my medical records',
                },
              },
            },
            'view:privateRecordsChoiceHelp': {
              'ui:description': medicalRecDescription,
            },
          },
          schema: {
            type: 'object',
            properties: {
              uploadRecs: {
                type: 'string',
                'enum': ['Yes', 'No'],
              },
              'view:privateRecordsChoiceHelp': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        page2: {
          path: 'second-page',
          title: 'Second Page',
          uiSchema: {
            'view:privateRecordDescription': {
              'ui:description': letUsKnow
            },
            privateProviderInfo: {
              'ui:title': 'Name of private provider or hospital',
            },
            // 'view:limitedConsent': { //TODO
            //   'ui:description': 'limited consent description'
            // },
          },
          schema: {
            type: 'object',
            properties: {
              'view:privateRecordDescription': {
                type: 'object',
                properties: {},
              },
              privateProviderInfo: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
