import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';

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
