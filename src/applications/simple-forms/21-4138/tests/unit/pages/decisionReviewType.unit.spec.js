import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementTypeChapter.pages.selectDecisionReviewPage;

const pageConfig = {
  data: {},
  numberOfErrors: 0,
  numberOfFields: 0,
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 1,
  pageTitle: 'Which description is true for you?',
  schema,
  uiSchema,
};

testPage(pageConfig);
