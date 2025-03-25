import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
  title,
} = formConfig.chapters.statementTypeChapter.pages.priorityProcessingPage;

const pageTestExpectation = {
  pageTitle: title,
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
