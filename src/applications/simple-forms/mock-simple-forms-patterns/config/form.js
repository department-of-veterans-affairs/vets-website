import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import textInput from '../pages/textInput';
import textInputWidgets1 from '../pages/textInputWidgets1';
import textInputFullName from '../pages/textInputFullName';
// import checkbox from '../pages/checkbox';
// import radio from '../pages/radio';
// import select from '../pages/select';
// import date from '../pages/date';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/forms_api/v1/simple_forms`,
  trackingPrefix: 'mock-simple-forms-patterns-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'FORM_MOCK_SF_PATTERNS',
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
    textInput: {
      title: 'Text Input',
      pages: {
        textInput: {
          path: 'text-input',
          title: 'Text Input',
          uiSchema: textInput.uiSchema,
          schema: textInput.schema,
          initialData: textInput.initialData,
        },
        textInputWidgets1: {
          path: 'text-input-widgets1',
          title: 'Text Input Widgets 1',
          uiSchema: textInputWidgets1.uiSchema,
          schema: textInputWidgets1.schema,
        },
        textInputFullName: {
          path: 'text-input-full-name',
          title: 'Text Input Full Name',
          uiSchema: textInputFullName.uiSchema,
          schema: textInputFullName.schema,
          initialData: textInputFullName.initialData,
        },
      },
    },
    // checkbox: {
    //   title: 'Checkbox',
    //   pages: {
    //     checkbox: {
    //       path: 'checkbox',
    //       title: 'Checkbox',
    //       uiSchema: checkbox.uiSchema,
    //       schema: checkbox.schema,
    //     },
    //   },
    // },
    // select: {
    //   title: 'Select',
    //   pages: {
    //     checkbox: {
    //       path: 'select',
    //       title: 'Select',
    //       uiSchema: select.uiSchema,
    //       schema: select.schema,
    //     },
    //   },
    // },
    // radio: {
    //   title: 'Radio',
    //   pages: {
    //     checkbox: {
    //       path: 'radio',
    //       title: 'Radio',
    //       uiSchema: radio.uiSchema,
    //       schema: radio.schema,
    //     },
    //   },
    // },
    // date: {
    //   title: 'Date',
    //   pages: {
    //     checkbox: {
    //       path: 'date',
    //       title: 'Date',
    //       uiSchema: date.uiSchema,
    //       schema: date.schema,
    //     },
    //   },
    // },
  },
};

export default formConfig;
