// import fullSchema from 'vets-json-schema/dist/XX-230-schema.json';
import {
  emailSchema,
  emailUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import manifest from '../manifest.json';
// import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v1/profile/tutorial-test/submit',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'tutorial-test-',
  confirmation: ConfirmationPage,
  formId: 'XX-230',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your tutorial test application (XX-230) is in progress.',
    //   expired: 'Your saved tutorial test application (XX-230) has expired. If you want to apply for tutorial test, please start a new application.',
    //   saved: 'Your tutorial test application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for tutorial test.',
    noAuth:
      'Please sign in again to continue your application for tutorial test.',
  },
  title: 'tutorial-test',
  defaultDefinitions: {},
  chapters: {
    emailChapter: {
      title: 'Steps',
      pages: {
        page1: {
          path: 'first-page',
          title: 'Add your contact email address',
          uiSchema: {
            ...titleUI('Add your contact email address'),
            emailAddress: emailUI(),
          },
          schema: {
            type: 'object',
            properties: {
              emailAddress: emailSchema,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
