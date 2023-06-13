import {
  testNumberOfErrorsOnSubmitWebComponents,
  testNumberOfFieldsWebComponents,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerIdentificationInformationChapter.pages.preparerIdentificationInformation;

const pageTitle = 'preparer identification information';

const expectedNumberOfFields = 1;
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
