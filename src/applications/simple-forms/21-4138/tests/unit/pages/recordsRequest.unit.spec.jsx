import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementTypeChapter.pages.personalRecordsRequestPage;

const pageTestExpectation = {
  pageTitle: "There's a better way to request your personal records",
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
