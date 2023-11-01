import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.disclosureInfoChapter.pages.organizationRepresentativesPage;

const pageTitle = 'Organization’s representatives';

const expectedNumberOfFields = 2;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
