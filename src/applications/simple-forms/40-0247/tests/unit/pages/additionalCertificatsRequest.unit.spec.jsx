import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../../shared/tests/pages/pageTests.spec';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.additionalCertificatesChapter.pages.additionalCertificatesRequestPage;

const pageTitle = 'Additional certificates request';

const expectedNumberOfFields = 7;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 5;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
