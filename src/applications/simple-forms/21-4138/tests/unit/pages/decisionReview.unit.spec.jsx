import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementTypeChapter.pages.decisionReviewPage;

const pageTestExpectation = {
  pageTitle: 'There’s a better way to tell us you disagree with a decision',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
