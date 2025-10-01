import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranIdentificationInfoChapter.pages.veteranIdentificationInfoPage;

const pageTitle = 'Veteran’s identification information';

const expectedNumberOfWcFields = 2;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWcFields,
  pageTitle,
);

const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
