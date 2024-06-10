import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementTypeChapter.pages.statementTypePage;

const pageConfig = {
  data: {},
  numberOfErrors: 0,
  numberOfFields: 0,
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 1,
  pageTitle: 'What kind of statement do you want to submit?',
  schema,
  uiSchema,
};

testPage(pageConfig);
