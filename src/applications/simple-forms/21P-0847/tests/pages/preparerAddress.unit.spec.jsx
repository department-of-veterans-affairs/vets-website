import {
  testNumberOfErrorsOnSubmitWebComponents,
  testNumberOfFieldsWebComponents,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerAddressChapter.pages.preparerAddress;

const pageTitle = 'preparer address';

const expectedNumberOfFields = 8;
testNumberOfFieldsWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 4;
testNumberOfErrorsOnSubmitWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
