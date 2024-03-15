import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.checkbox.pages.checkboxAndTextInput;

const pageTitle = 'mock checkbox and text input';

const expectedNumberOfWebComponentFields = 4;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

const expectedNumberOfWebComponentErrors = 3;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);
