import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranContactInformationChapter.pages.veteranContactInformationPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 2,
  numberOfWebComponentFields: 2,
  pageTitle: "Veteran's phone number and email address",
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
