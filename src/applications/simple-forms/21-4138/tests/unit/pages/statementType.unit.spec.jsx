import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementTypeChapter.pages.statementTypePage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 1,
  pageTitle: 'What would you like to do?',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
