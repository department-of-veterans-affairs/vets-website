import {
  testNumberOfErrorsOnSubmitWebComponents,
  testNumberOfFieldsWebComponents,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranPersonalInformationChapter.pages.veteranPersonalInformation;

const pageTitle = 'veteran personal information';

const expectedNumberOfFields = 3;
testNumberOfFieldsWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 2;
testNumberOfErrorsOnSubmitWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
