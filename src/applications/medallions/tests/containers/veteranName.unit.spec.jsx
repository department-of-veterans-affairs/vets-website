import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../simple-forms/shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranInformation.pages.veteranName;

const pageTitle = 'Vereran name';

const expectedNumberOfFields = 4;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 2;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
