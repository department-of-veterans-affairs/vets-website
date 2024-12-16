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

let data = {};

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

// veteran with email - point of contact should not be required
let expectedNumberOfWebComponentErrors = 0;

// test on dev before making this change
if (environment.isDev() || environment.isLocalhost()) {
  expectedNumberOfWebComponentErrors = 0;
}

data = {
  preparerType: 'veteran',
  veteranEmailAddress: 'veteran@email.com',
};

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
  data,
);

// veteran without email - point of contact should be required
expectedNumberOfWebComponentErrors = 0;

// test on dev before making this change
if (environment.isDev() || environment.isLocalhost()) {
  expectedNumberOfWebComponentErrors = 1;
}

data = {
  preparerType: 'veteran',
};

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
