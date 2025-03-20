import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementTypeChapter.pages.claimStatusToolPage;

const pageTestExpectation = {
  pageTitle: "There's a better way to submit new evidence",
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
