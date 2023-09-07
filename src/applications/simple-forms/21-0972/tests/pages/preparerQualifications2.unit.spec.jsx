import {
  testNumberOfErrorsOnSubmit,
  testNumberOfWebComponentFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerQualificationsChapter.pages.preparerQualifications2;

const pageTitle = 'preparer qualifications 2';

const expectedNumberOfFields = 3;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

/* Expect 1 instead of 3 errors.
GroupCheckboxWidget displays 1 error-message 
for its 3 shadow-DOM fields.
Error shows up as alert instead of node label. */
const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
