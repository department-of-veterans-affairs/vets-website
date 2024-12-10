import environment from 'platform/utilities/environment';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.contactInformationChapter.pages.pointOfContactPage;

const pageTitle = 'Your point of contact';

const data = {};

let expectedNumberOfWebComponentFields = 2;

// test on dev before making this change
if (environment.isDev() || environment.isLocalhost()) {
  expectedNumberOfWebComponentFields = 3;
}

testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
  data,
);

let expectedNumberOfWebComponentErrors = 0;

// test on dev before making this change
if (environment.isDev() || environment.isLocalhost()) {
  expectedNumberOfWebComponentErrors = 1;
}

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
  data,
);

const expectedNumberOfFields = 0;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  data,
);

const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  data,
);
