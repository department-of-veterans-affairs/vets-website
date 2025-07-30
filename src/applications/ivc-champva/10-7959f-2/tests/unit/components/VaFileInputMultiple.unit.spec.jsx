import {
  testNumberOfErrorsOnSubmit,
  // testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';

const { schema, uiSchema } = formConfig.chapters.fileUpload.pages.page7;

const pageTitle = 'mock file input multiple';

const expectedNumberOfWebComponentFields = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

/* July 11, 2025 - disabling this test as it appears to be buggy
(i.e., errors should not be present when it first renders).
In the node 22 environment, zero errors are present on initial
render, but in the node 14 environment there is one error.
Since there's no overlap between those two options, this test is
currently disabled. When we migrate to node 22 we could re-enable
it (though it's somewhat dubious what benefit it provides + the
component it tests will be replaced by the official platform
multi-file input pattern eventually anyway). 
TODO: enable when node 22 is active
Original comment follows: */
/*
// On initial render the "this field is required" error is active
const expectedNumberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);
*/

const expectedNumberOfFields = 0;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
