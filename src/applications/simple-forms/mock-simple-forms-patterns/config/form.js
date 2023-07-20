import environment from 'platform/utilities/environment';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import textInput from '../pages/mockTextInput';
import textInputWidgets1 from '../pages/mockTextInputWidgets1';
import textInputFullName from '../pages/mockTextInputFullName';
import textInputAddress from '../pages/mockTextInputAddress';
import textInputSsn from '../pages/mockTextInputSsn';
import checkboxAndTextInput from '../pages/mockCheckboxAndTextInput';
import radio from '../pages/mockRadio';
import radioRelationshipToVeteran from '../pages/mockRadioRelationshipToVeteran';
import select from '../pages/mockSelect';
import date from '../pages/mockDate';
import arraySinglePage from '../pages/mockArraySinglePage';
import arrayMultiplePageStart from '../pages/mockArrayMultiplePageStart';
import arrayMultiplePageItem from '../pages/mockArrayMultiplePageItem';

// helps for dev testing and e2e
const INCLUDE_PAGE = {
  text: true,
  radio: true,
  checkbox: true,
  select: true,
  date: true,
  arraySingle: true,
  arrayMulti: true,
};

function includePage(page) {
  return INCLUDE_PAGE[page] ?? true;
}

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  dev: {
    showNavLinks: true,
  },
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
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
          title: 'Text Input', // for review page (has to be more than one word)
          uiSchema: textInput.uiSchema,
          schema: textInput.schema,
          initialData: textInput.initialData,
          // dont use depends here - needs first page for e2e
        },
        textInputWidgets1: {
          path: 'text-input-widgets1',
          title: 'Text Input Widgets 1', // for review page (has to be more than one word)
          uiSchema: textInputWidgets1.uiSchema,
          schema: textInputWidgets1.schema,
          depends: () => includePage('text'),
        },
        textInputFullName: {
          path: 'text-input-full-name',
          title: 'Text Input Full Name', // for review page (has to be more than one word)
          uiSchema: textInputFullName.uiSchema,
          schema: textInputFullName.schema,
          initialData: textInputFullName.initialData,
          depends: () => includePage('text'),
        },
        textInputAddress: {
          title: 'Text Input Address', // for review page (has to be more than one word)
          path: 'text-input-address',
          uiSchema: textInputAddress.uiSchema,
          schema: textInputAddress.schema,
          initialData: textInputAddress.initialData,
          depends: () => includePage('text'),
        },
        textInputSsn: {
          title: 'SSN Pattern', // for review page (has to be more than one word)
          path: 'ssn-pattern',
          uiSchema: textInputSsn.uiSchema,
          schema: textInputSsn.schema,
          depends: () => includePage('text'),
        },
      },
      depends: () => false,
    },
    checkbox: {
      title: 'Checkbox',
      pages: {
        checkboxAndTextInput: {
          title: 'Checkbox and text input', // for review page (has to be more than one word)
          path: 'checkbox-and-text-input',
          uiSchema: checkboxAndTextInput.uiSchema,
          schema: checkboxAndTextInput.schema,
          depends: () => includePage('checkbox'),
        },
      },
    },
    select: {
      title: 'Select',
      pages: {
        select: {
          title: 'Select Page', // for review page (has to be more than one word)
          path: 'select',
          uiSchema: select.uiSchema,
          schema: select.schema,
          depends: () => includePage('select'),
        },
      },
    },
    radio: {
      title: 'Radio',
      pages: {
        radio: {
          title: 'Radio Page', // for review page (has to be more than one word)
          path: 'radio',
          uiSchema: radio.uiSchema,
          schema: radio.schema,
          depends: () => includePage('radio'),
        },
        radioRelationshipToVeteran: {
          path: 'radio-relationship-to-veteran',
          title: 'Radio Relationship to Veteran',
          uiSchema: radioRelationshipToVeteran.uiSchema,
          schema: radioRelationshipToVeteran.schema,
        },
      },
    },
    date: {
      title: 'Date',
      pages: {
        date: {
          title: 'Dates / time', // for review page (has to be more than one word)
          path: 'date',
          uiSchema: date.uiSchema,
          schema: date.schema,
          depends: () => includePage('date'),
        },
      },
    },
    arraySinglePage: {
      title: 'Array Single Page',
      pages: {
        arraySinglePage: {
          path: 'array-single-page',
          title: 'Information for Single Page', // for review page (has to be more than one word)
          uiSchema: arraySinglePage.uiSchema,
          schema: arraySinglePage.schema,
          depends: () => includePage('arraySingle'),
        },
      },
    },
    arrayMultiplePage: {
      title: 'Array Multiple Pages',
      pages: {
        multiplePageStart: {
          title: 'Multiple Page Start Title', // for review page (has to be more than one word)
          path: 'array-multiple-page',
          uiSchema: arrayMultiplePageStart.uiSchema,
          schema: arrayMultiplePageStart.schema,
          depends: () => includePage('arrayMulti'),
        },
        multiplePageItem: {
          title: 'Multiple Page Item Title', // for review page (has to be more than one word)
          path: 'array-multiple-page/:index',
          showPagePerItem: true,
          arrayPath: 'exampleArrayData',
          uiSchema: arrayMultiplePageItem.uiSchema,
          schema: arrayMultiplePageItem.schema,
          depends: () => includePage('arrayMulti'),
        },
      },
    },
  },
};

export default formConfig;
