import environment from 'platform/utilities/environment';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import textInput from '../pages/textInput';
import textInputWidgets1 from '../pages/textInputWidgets1';
import textInputFullName from '../pages/textInputFullName';
import textInputAddress from '../pages/textInputAddress';
import textInputSsn from '../pages/textInputSsn';
import checkboxAndTextInput from '../pages/checkboxAndTextInput';
// import checkboxGroup from '../pages/checkboxGroup';
// import radio from '../pages/radio';
import select from '../pages/select';
import date from '../pages/date';

/** @type {FormConfig} */
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
  defaultDefinitions: commonDefinitions,
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
        textInputAddress: {
          path: 'text-input-address',
          title: 'Text Input Address',
          uiSchema: textInputAddress.uiSchema,
          schema: textInputAddress.schema,
          initialData: textInputAddress.initialData,
        },
        textInputSsn: {
          path: 'ssn-pattern',
          title: 'SSN Pattern',
          uiSchema: textInputSsn.uiSchema,
          schema: textInputSsn.schema,
        },
        checkboxAndTextInput: {
          path: 'checkbox-and-text-input',
          title: 'Checkbox and text input',
          uiSchema: checkboxAndTextInput.uiSchema,
          schema: checkboxAndTextInput.schema,
        },
        // checkboxGroup: {
        //   path: 'checkbox-group',
        //   title: 'Checkbox group',
        //   uiSchema: checkboxGroup.uiSchema,
        //   schema: checkboxGroup.schema,
        // },
      },
    },
    select: {
      title: 'Select',
      pages: {
        select: {
          path: 'select',
          title: 'Select',
          uiSchema: select.uiSchema,
          schema: select.schema,
        },
      },
    },
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
    date: {
      title: 'Date',
      pages: {
        checkbox: {
          path: 'date',
          title: 'Date',
          uiSchema: date.uiSchema,
          schema: date.schema,
        },
      },
    },
  },
};

export default formConfig;
