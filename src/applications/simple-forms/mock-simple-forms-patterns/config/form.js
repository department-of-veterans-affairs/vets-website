import environment from 'platform/utilities/environment';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import chapterSelect from '../pages/chapterSelect';
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
import formsPatternSingleRadio from '../pages/mockFormsPatternSingleRadio';
import formsPatternSingleCheckboxGroup from '../pages/mockFormsPatternSingleCheckboxGroup';
import formsPatternMultiple from '../pages/mockFormsPatternMultiple';
import arraySinglePage from '../pages/mockArraySinglePage';
import arrayMultiPageAggregateStart from '../pages/mockArrayMultiPageAggregateStart';
import arrayMultiPageAggregateItem from '../pages/mockArrayMultiPageAggregateItem';
import arrayMultiPageBuilderSummary from '../pages/mockArrayMultiPageBuilderSummary';
import arrayMultiPageBuilderItemPage1 from '../pages/mockArrayMultiPageBuilderItemPage1';
import arrayMultiPageBuilderItemPage2 from '../pages/mockArrayMultiPageBuilderItemPage2';
import {
  onNavBackKeepUrlParams,
  onNavForwardKeepUrlParams,
  onNavBackRemoveAddingItem,
} from '../arrayBuilder/helpers';

const chapterSelectInitialData = {
  chapterSelect: {
    textInput: true,
    numberInput: true,
    formsPattern: true,
    checkbox: true,
    radio: true,
    select: true,
    date: true,
    arraySinglePage: true,
    arrayMultiPageAggregate: true,
    arrayMultiPageBuilder: true,
  },
};

function includeChapter(page) {
  return formData => formData?.chapterSelect[page];
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
    chapterSelect: {
      title: 'Chapter Select',
      pages: {
        chapterSelect: {
          title: 'Chapter Select',
          path: 'chapter-select',
          ...chapterSelect,
          initialData: chapterSelectInitialData,
        },
      },
    },
    textInput: {
      title: 'Text Input',
      pages: {
        textInput: {
          path: 'text-input',
          title: 'Text Input', // for review page (has to be more than one word)
          uiSchema: textInput.uiSchema,
          schema: textInput.schema,
          depends: includeChapter('textInput'),
        },
        textInputWidgets1: {
          path: 'text-input-widgets1',
          title: 'Text Input Widgets 1', // for review page (has to be more than one word)
          uiSchema: textInputWidgets1.uiSchema,
          schema: textInputWidgets1.schema,
          depends: includeChapter('textInput'),
        },
        textInputFullName: {
          path: 'text-input-full-name',
          title: 'Text Input Full Name', // for review page (has to be more than one word)
          uiSchema: textInputFullName.uiSchema,
          schema: textInputFullName.schema,
          initialData: textInputFullName.initialData,
          depends: includeChapter('textInput'),
        },
        textInputAddress: {
          title: 'Text Input Address', // for review page (has to be more than one word)
          path: 'text-input-address',
          uiSchema: textInputAddress.uiSchema,
          schema: textInputAddress.schema,
          initialData: textInputAddress.initialData,
          depends: includeChapter('textInput'),
        },
        textInputSsn: {
          title: 'SSN Pattern', // for review page (has to be more than one word)
          path: 'ssn-pattern',
          uiSchema: textInputSsn.uiSchema,
          schema: textInputSsn.schema,
          depends: includeChapter('textInput'),
        },
      },
    },
    numberInput: {
      title: 'Number Input',
      pages: {
        numberInput: {
          path: 'number-input',
          title: 'Number Input', // for review page (has to be more than one word)
          uiSchema: numberInput.uiSchema,
          schema: numberInput.schema,
          depends: includeChapter('numberInput'),
        },
      },
    },
    formsPattern: {
      title: 'Forms Pattern',
      pages: {
        formsPatternSingleRadio: {
          path: 'forms-pattern-single-radio',
          title: 'Forms Pattern Single Radio title for review page',
          uiSchema: formsPatternSingleRadio.uiSchema,
          schema: formsPatternSingleRadio.schema,
          depends: includeChapter('formsPattern'),
        },
        formsPatternSingleCheckboxGroup: {
          path: 'forms-pattern-single-checkbox-group',
          title: 'Forms Pattern Single Checkbox group title for review page',
          uiSchema: formsPatternSingleCheckboxGroup.uiSchema,
          schema: formsPatternSingleCheckboxGroup.schema,
          depends: includeChapter('formsPattern'),
        },
        formsPatternMultiple: {
          path: 'forms-pattern-multiple',
          title: 'Forms Pattern Multiple title for review page',
          uiSchema: formsPatternMultiple.uiSchema,
          schema: formsPatternMultiple.schema,
          depends: includeChapter('formsPattern'),
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
          depends: includeChapter('checkbox'),
        },
        checkboxGroup: {
          title: 'Checkbox group',
          path: 'checkbox-group',
          uiSchema: checkboxGroup.uiSchema,
          schema: checkboxGroup.schema,
          depends: includeChapter('checkbox'),
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
          depends: includeChapter('select'),
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
          depends: includeChapter('radio'),
        },
        radioRelationshipToVeteran: {
          path: 'radio-relationship-to-veteran',
          title: 'Radio Relationship to Veteran',
          uiSchema: radioRelationshipToVeteran.uiSchema,
          schema: radioRelationshipToVeteran.schema,
          depends: includeChapter('radio'),
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
          depends: includeChapter('date'),
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
          depends: includeChapter('arraySinglePage'),
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
          depends: includeChapter('arrayMultiPageAggregate'),
        },
        multiPageItem: {
          title: 'Multiple Page Details Title', // for review page (has to be more than one word)
          path: 'array-multiple-page-aggregate-details/:index',
          showPagePerItem: true,
          arrayPath: 'exampleArrayData',
          uiSchema: arrayMultiPageAggregateItem.uiSchema,
          schema: arrayMultiPageAggregateItem.schema,
          depends: includeChapter('arrayMultiPageAggregate'),
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
              goPath(
                `/array-multiple-page-builder-item-page-1/${index}?add=true`,
              );
            } else {
              goPath('/review-and-submit');
            }
          },
          depends: includeChapter('arrayMultiPageBuilder'),
        },
        multiPageBuilderStepOne: {
          title: 'Multiple Page Item Title', // for review page (has to be more than one word)
          path: 'array-multiple-page-builder-item-page-1/:index',
          showPagePerItem: true,
          allowPathWithNoItems: true,
          arrayPath: 'employers',
          uiSchema: arrayMultiPageBuilderItemPage1.uiSchema,
          schema: arrayMultiPageBuilderItemPage1.schema,
          onNavBack: onNavBackRemoveAddingItem({
            arrayPath: 'employers',
            summaryPathUrl: '/array-multiple-page-builder-summary',
          }),
          onNavForward: onNavForwardKeepUrlParams,
          ContentBeforeButtons:
            arrayMultiPageBuilderItemPage1.ContentBeforeButtons,
          depends: formData =>
            includeChapter('arrayMultiPageBuilder')(formData) &&
            (formData.hasEmployment || formData.employers?.length > 0),
        },
        multiPageBuilderStepTwo: {
          title: 'Multiple Page Item Title', // for review page (has to be more than one word)
          path: 'array-multiple-page-builder-item-page-2/:index',
          showPagePerItem: true,
          allowPathWithNoItems: true,
          arrayPath: 'employers',
          uiSchema: arrayMultiPageBuilderItemPage2.uiSchema,
          schema: arrayMultiPageBuilderItemPage2.schema,
          onNavBack: onNavBackKeepUrlParams,
          ContentBeforeButtons:
            arrayMultiPageBuilderItemPage1.ContentBeforeButtons,
          depends: formData =>
            includeChapter('arrayMultiPageBuilder')(formData) &&
            (formData.hasEmployment || formData.employers?.length > 0),
          onNavForward: ({ goPath }) => {
            goPath('/array-multiple-page-builder-summary');
          },
        },
      },
    },
  },
};

export default formConfig;
