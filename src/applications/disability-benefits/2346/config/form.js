// import fullSchema from 'vets-json-schema/dist/2346-schema.json';

import ConfirmAddress from '../Components/ConfirmAddress';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: '2346-',
  introduction: ConfirmAddress,
  confirmation: ConfirmationPage,
  formId: '2346',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for 2346 Benefits.',
    noAuth:
      'Please sign in again to continue your application for 2346 Benefits.',
  },
  title: 'Form-2346',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {
            'ui:title': 'My field label',
            'ui:widget': 'radio',
          },
          schema: {
            type: 'object',
            required: ['myField'],
            properties: {
              myField: {
                type: 'string',
                enum: ['First option', 'Second option'],
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
