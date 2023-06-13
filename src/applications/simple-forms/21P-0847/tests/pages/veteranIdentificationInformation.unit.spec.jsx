import {
  testNumberOfErrorsOnSubmitWebComponents,
  testNumberOfFieldsWebComponents,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranIdentificationInformationChapter.pages.veteranIdentificationInformation;

const pageTitle = 'veteran identification information';

const expectedNumberOfFields = 2;
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
