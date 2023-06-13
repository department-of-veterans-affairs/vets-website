import {
  testNumberOfErrorsOnSubmitWebComponents,
  testNumberOfFieldsWebComponents,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerContactInformationChapter.pages.preparerContactInformation;

const pageTitle = 'preparer contact information';

const expectedNumberOfFields = 3;
testNumberOfFieldsWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmitWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
