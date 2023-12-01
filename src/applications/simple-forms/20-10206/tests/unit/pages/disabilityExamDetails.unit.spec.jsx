import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.disabilityExamDetailsChapter.pages.disabilityExamDetailsPage;

const pageTitle = 'Disability exam details';

const expectedNumberOfFields = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
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
