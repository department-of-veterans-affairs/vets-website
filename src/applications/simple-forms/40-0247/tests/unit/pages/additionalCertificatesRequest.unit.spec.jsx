import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.additionalCertificatesChapter.pages.additionalCertificatesRequestPage;

const pageTitle = 'Additional certificates request';

const expectedNumberOfFields = 7;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 5;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
