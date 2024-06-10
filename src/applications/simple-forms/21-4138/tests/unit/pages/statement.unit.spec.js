import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementChapter.pages.statementPage;

const pageConfig = {
  data: {},
  numberOfErrors: 0,
  numberOfFields: 0,
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 1,
  pageTitle: 'Provide your statement',
  schema,
  uiSchema,
};

testPage(pageConfig);
