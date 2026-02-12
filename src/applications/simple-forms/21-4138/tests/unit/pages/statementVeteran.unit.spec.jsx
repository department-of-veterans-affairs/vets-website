import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementChapter.pages.statementVeteranPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 1,
  pageTitle: 'Your statement',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);

