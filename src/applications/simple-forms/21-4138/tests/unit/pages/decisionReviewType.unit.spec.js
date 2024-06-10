import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementTypeChapter.pages.selectDecisionReviewPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 1,
  pageTitle: 'Which description is true for you?',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
