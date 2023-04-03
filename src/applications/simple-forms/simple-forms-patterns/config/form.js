import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import textInputs from '../pages/textInputs';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/forms_api/v1/simple_forms`,
  trackingPrefix: 'simple-forms-patterns-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'FORM_SF_PATTERNS',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for simple form patterns.',
    noAuth:
      'Please sign in again to continue your application for simple form patterns.',
  },
  title: 'Simple Forms Patterns',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Text Inputs',
      pages: {
        textInput: {
          path: 'text-inputs',
          title: 'Text Inputs',
          uiSchema: textInputs.uiSchema,
          schema: textInputs.schema,
        },
      },
    },
  },
};

export default formConfig;
