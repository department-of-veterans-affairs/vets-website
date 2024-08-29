import environment from 'platform/utilities/environment';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
// pages
import chapterSelect from '../pages/chapterSelect';
import textInput from '../pages/mockTextInput';
import textEmailPhone from '../pages/mockTextEmailPhone';
import numberInput from '../pages/mockNumberInput';
import fullName from '../pages/mockFullName';
import address from '../pages/mockAddress';
import ssn from '../pages/mockSsn';
import checkboxAndTextInput from '../pages/mockCheckboxAndTextInput';
import checkboxGroup from '../pages/mockCheckboxGroup';
import radio from '../pages/mockRadio';
import radioRelationshipToVeteran from '../pages/mockRadioRelationshipToVeteran';
import select from '../pages/mockSelect';
import date from '../pages/mockDate';
import dynamicFields from '../pages/mockDynamicFields';
import formsPatternSingleRadio from '../pages/mockFormsPatternSingleRadio';
import formsPatternSingleCheckboxGroup from '../pages/mockFormsPatternSingleCheckboxGroup';
import formsPatternMultiple from '../pages/mockFormsPatternMultiple';
import arraySinglePage from '../pages/mockArraySinglePage';
import arrayMultiPageAggregateStart from '../pages/mockArrayMultiPageAggregateStart';
import arrayMultiPageAggregateItem from '../pages/mockArrayMultiPageAggregateItem';
// import arrayAddresses from '../pages/mockArrayAddresses';

import {
  employersDatesPage,
  employersIntroPage,
  employersOptions,
  employersPageNameAndAddressPage,
  employersSummaryPage,
} from '../pages/mockArrayMultiPageBuilderPages';
import { MockCustomPage, mockCustomPage } from '../pages/mockCustomPage';
import arrayBuilderPatternChooseFlow from '../pages/mockArrayMultiPageBuilderChooseFlow';
import NewConfirmationPage from '../containers/ConfirmationPage.new';

const chapterSelectInitialData = {
  chapterSelect: {
    arrayMultiPageAggregate: true,
    arrayMultiPageBuilder: true,
    arraySinglePage: true,
    checkbox: true,
    confirmationPageNew: false,
    date: true,
    formsPattern: true,
    miscellaneous: true,
    numberInput: true,
    radio: true,
    select: true,
    textInput: true,
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
    collapsibleNavLinks: true,
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
        textEmailPhone: {
          path: 'text-input-widgets1',
          title: 'Text Input Widgets 1', // for review page (has to be more than one word)
          uiSchema: textEmailPhone.uiSchema,
          schema: textEmailPhone.schema,
          depends: includeChapter('textInput'),
        },
        fullName: {
          path: 'text-input-full-name',
          title: 'Text Input Full Name', // for review page (has to be more than one word)
          uiSchema: fullName.uiSchema,
          schema: fullName.schema,
          initialData: fullName.initialData,
          depends: includeChapter('textInput'),
        },
        address: {
          title: 'Text Input Address', // for review page (has to be more than one word)
          path: 'text-input-address',
          uiSchema: address.uiSchema,
          schema: address.schema,
          initialData: address.initialData,
          depends: includeChapter('textInput'),
        },
        ssn: {
          title: 'SSN Pattern', // for review page (has to be more than one word)
          path: 'ssn-pattern',
          uiSchema: ssn.uiSchema,
          schema: ssn.schema,
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
    miscellaneous: {
      title: 'Miscellaneous',
      pages: {
        dynamicFields: {
          title: 'Dynamic fields', // for review page (has to be more than one word)
          path: 'dynamic-fields',
          uiSchema: dynamicFields.uiSchema,
          schema: dynamicFields.schema,
          depends: includeChapter('miscellaneous'),
        },
        mockCustomPage: {
          path: 'mock-custom-page',
          title: 'Mock Custom Page', // for review page (has to be more than one word)
          CustomPage: MockCustomPage,
          uiSchema: mockCustomPage.uiSchema,
          schema: mockCustomPage.schema,
          depends: includeChapter('miscellaneous'),
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
        // hide until preexisting addressUI bugs are fixed
        // arrayAddresses: {
        //   title: 'Multiple Addresses', // for review page (has to be more than one word)
        //   path: 'array-addresses',
        //   uiSchema: arrayAddresses.uiSchema,
        //   schema: arrayAddresses.schema,
        //   depends: includeChapter('arraySinglePage'),
        // },
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
      title: 'Array Multi-Page Builder (WIP)',
      pages: {
        // this page is not part of the pattern, but is needed
        // to showcase the 2 different styles of array builder pattern
        multiPageBuilderChooseFlow: {
          title: 'Array builder pattern choose flow',
          path: 'array-multiple-page-builder-choose-flow',
          uiSchema: arrayBuilderPatternChooseFlow.uiSchema,
          schema: arrayBuilderPatternChooseFlow.schema,
          depends: includeChapter('arrayMultiPageBuilder'),
          initialData: {
            arrayBuilderPatternFlowType: 'required',
          },
        },
        ...arrayBuilderPages(employersOptions, pageBuilder => ({
          // introPage needed for "required" flow
          multiPageBuilderIntro: pageBuilder.introPage({
            title: 'Your Employers',
            path: 'array-multiple-page-builder',
            uiSchema: employersIntroPage.uiSchema,
            schema: employersIntroPage.schema,
            depends: formData =>
              includeChapter('arrayMultiPageBuilder')(formData) &&
              // normally you don't need this kind of check,
              // but this is so we can test the 2 different styles
              // of array builder pattern - "required" and "optional".
              // "introPage" is needed in the "required" flow,
              // but unnecessary in the "optional" flow
              formData?.arrayBuilderPatternFlowType === 'required',
          }),
          multiPageBuilderSummary: pageBuilder.summaryPage({
            title: 'Array with multiple page builder summary',
            path: 'array-multiple-page-builder-summary',
            uiSchema: employersSummaryPage.uiSchema,
            schema: employersSummaryPage.schema,
            depends: includeChapter('arrayMultiPageBuilder'),
          }),
          multiPageBuilderStepOne: pageBuilder.itemPage({
            title: 'Employer name and address',
            path: 'array-multiple-page-builder/:index/name-and-address',
            uiSchema: employersPageNameAndAddressPage.uiSchema,
            schema: employersPageNameAndAddressPage.schema,
            depends: includeChapter('arrayMultiPageBuilder'),
          }),
          multiPageBuilderStepTwo: pageBuilder.itemPage({
            title: 'Employer dates',
            path: 'array-multiple-page-builder/:index/dates',
            uiSchema: employersDatesPage.uiSchema,
            schema: employersDatesPage.schema,
            depends: includeChapter('arrayMultiPageBuilder'),
          }),
        })),
      },
    },
    staticPages: {
      title: 'Static Pages',
      pages: {
        confirmationPageNew: {
          path: 'confirmation-page-new',
          title: 'New Confirmation Page',
          CustomPage: NewConfirmationPage,
          uiSchema: mockCustomPage.uiSchema,
          schema: mockCustomPage.schema,
          pageKey: 'confirmation-page-new',
          depends: () => false,
        },
      },
    },
  },
};

export default formConfig;
