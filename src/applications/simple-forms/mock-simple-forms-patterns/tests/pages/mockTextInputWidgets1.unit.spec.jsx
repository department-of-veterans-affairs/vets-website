import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const { schema, uiSchema } = formConfig.chapters.textInput.pages.textEmailPhone;

const pageTitle = 'mock text input widgets';

const expectedNumberOfWebComponentFields = 2;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

const expectedNumberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);
