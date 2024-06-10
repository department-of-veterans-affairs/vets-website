import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.statementTypeChapter.pages.layWitnessStatementPage;

const pageConfig = {
  data: {},
  numberOfErrors: 0,
  numberOfFields: 0,
  numberOfWebComponentErrors: 0,
  numberOfWebComponentFields: 0,
  pageTitle: "There's a better way to submit your statement to us",
  schema,
  uiSchema,
};

testPage(pageConfig);
