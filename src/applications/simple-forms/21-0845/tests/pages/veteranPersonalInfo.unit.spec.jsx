import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranPersonalInfoChapter.pages.vetPersInfoPage;

const pageTitle = 'Veteran’s information';

const expectedNumberOfFields = 6;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 2;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
