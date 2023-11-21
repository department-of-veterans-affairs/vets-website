import environment from 'platform/utilities/environment';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import textInput from '../pages/mockTextInput';
import textInputWidgets1 from '../pages/mockTextInputWidgets1';
import numberInput from '../pages/mockNumberInput';
import textInputFullName from '../pages/mockTextInputFullName';
import textInputAddress from '../pages/mockTextInputAddress';
import textInputSsn from '../pages/mockTextInputSsn';
import checkboxAndTextInput from '../pages/mockCheckboxAndTextInput';
import checkboxGroup from '../pages/mockCheckboxGroup';
import radio from '../pages/mockRadio';
import radioRelationshipToVeteran from '../pages/mockRadioRelationshipToVeteran';
import select from '../pages/mockSelect';
import date from '../pages/mockDate';
import arraySinglePage from '../pages/mockArraySinglePage';
import arrayMultiPageAggregateStart from '../pages/mockArrayMultiPageAggregateStart';
import arrayMultiPageAggregateItem from '../pages/mockArrayMultiPageAggregateItem';
import arrayMultiPageBuilderSummary from '../pages/mockArrayMultiPageBuilderSummary';
import arrayMultiPageBuilderItemPage1 from '../pages/mockArrayMultiPageBuilderItemPage1';
import arrayMultiPageBuilderItemPage2 from '../pages/mockArrayMultiPageBuilderItemPage2';

// helps for dev testing and e2e
const INCLUDE_PAGE = {
  text: true,
  number: true,
  radio: true,
  checkbox: true,
  select: true,
  date: true,
  arraySingle: true,
  arrayMulti: true,
};

function includePage(page) {
  return () => INCLUDE_PAGE[page] ?? true;
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
  v3SegmentedProgressBar: true,
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
          depends: includePage('text'),
        },
        textInputFullName: {
          path: 'text-input-full-name',
          title: 'Text Input Full Name', // for review page (has to be more than one word)
          uiSchema: textInputFullName.uiSchema,
          schema: textInputFullName.schema,
          initialData: textInputFullName.initialData,
          depends: includePage('text'),
        },
        textInputAddress: {
          title: 'Text Input Address', // for review page (has to be more than one word)
          path: 'text-input-address',
          uiSchema: textInputAddress.uiSchema,
          schema: textInputAddress.schema,
          initialData: textInputAddress.initialData,
          depends: includePage('text'),
        },
        textInputSsn: {
          title: 'SSN Pattern', // for review page (has to be more than one word)
          path: 'ssn-pattern',
          uiSchema: textInputSsn.uiSchema,
          schema: textInputSsn.schema,
          depends: includePage('text'),
        },
      },
      depends: () => false,
    },
    numberInput: {
      title: 'Number Input',
      pages: {
        numberInput: {
          path: 'number-input',
          title: 'Number Input', // for review page (has to be more than one word)
          uiSchema: numberInput.uiSchema,
          schema: numberInput.schema,
          depends: includePage('number'),
        },
      },
    },
    checkbox: {
      title: 'Checkbox',
      pages: {
        checkboxAndTextInput: {
          title: 'Checkbox and text input', // for review page (has to be more than one word)
          path: 'checkbox-and-text-input',
          uiSchema: checkboxAndTextInput.uiSchema,
          schema: checkboxAndTextInput.schema,
          depends: includePage('checkbox'),
        },
        checkboxGroup: {
          title: 'Checkbox group',
          path: 'checkbox-group',
          uiSchema: checkboxGroup.uiSchema,
          schema: checkboxGroup.schema,
          depends: includePage('checkbox'),
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
          depends: includePage('select'),
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
          depends: includePage('radio'),
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
          depends: includePage('date'),
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
          depends: includePage('arraySingle'),
        },
      },
    },
    arrayMultiPageAggregate: {
      title: 'Array Multi-Page Aggregate',
      pages: {
        multiPageStart: {
          title: 'Multiple Page Start Title', // for review page (has to be more than one word)
          path: 'array-multiple-page-aggregate',
          uiSchema: arrayMultiPageAggregateStart.uiSchema,
          schema: arrayMultiPageAggregateStart.schema,
          depends: includePage('arrayMulti'),
        },
        multiPageItem: {
          title: 'Multiple Page Details Title', // for review page (has to be more than one word)
          path: 'array-multiple-page-aggregate-details/:index',
          showPagePerItem: true,
          arrayPath: 'exampleArrayData',
          uiSchema: arrayMultiPageAggregateItem.uiSchema,
          schema: arrayMultiPageAggregateItem.schema,
          depends: includePage('arrayMulti'),
        },
      },
    },
    arrayMultiPageBuilder: {
      title: 'Array Multi-Page Builder',
      pages: {
        multiPageBuilderStart: {
          title: 'Array with multiple page builder summary', // for review page (has to be more than one word)
          path: 'array-multiple-page-builder-summary',
          uiSchema: arrayMultiPageBuilderSummary.uiSchema,
          schema: arrayMultiPageBuilderSummary.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData.hasEmployment) {
              const index = formData.employers ? formData.employers.length : 0;
              goPath(`/array-multiple-page-builder-item-page-1/${index}`);
            } else {
              goPath('/review-and-submit');
            }
          },
        },
        multiPageBuilderStepOne: {
          title: 'Multiple Page Item Title', // for review page (has to be more than one word)
          path: 'array-multiple-page-builder-item-page-1/:index',
          showPagePerItem: true,
          allowPathWithNoItems: true,
          arrayPath: 'employers',
          uiSchema: arrayMultiPageBuilderItemPage1.uiSchema,
          schema: arrayMultiPageBuilderItemPage1.schema,
          depends: formData =>
            formData.hasEmployment || formData.employers?.length > 0,
        },
        multiPageBuilderStepTwo: {
          title: 'Multiple Page Item Title', // for review page (has to be more than one word)
          path: 'array-multiple-page-builder-item-page-2/:index',
          showPagePerItem: true,
          allowPathWithNoItems: true,
          arrayPath: 'employers',
          uiSchema: arrayMultiPageBuilderItemPage2.uiSchema,
          schema: arrayMultiPageBuilderItemPage2.schema,
          depends: formData =>
            formData.hasEmployment || formData.employers?.length > 0,
          onNavForward: ({ goPath }) => {
            goPath('/array-multiple-page-builder-summary');
          },
        },
      },
    },
  },
};

export default formConfig;
