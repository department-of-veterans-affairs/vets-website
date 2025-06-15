import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementTypeChapter.pages.layWitnessStatementPage;

const pageTestExpectation = {
  pageTitle: "There's a better way to submit your statement",
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
