import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.financialRecordDetailsChapter.pages.financialRecordDetailsPage;

const pageTitle = 'Financial record details';

const expectedNumberOfFields = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
