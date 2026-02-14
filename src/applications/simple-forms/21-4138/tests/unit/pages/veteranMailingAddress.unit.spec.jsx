import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranContactInformationChapter.pages.veteranMailingAddressPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 4,
  numberOfWebComponentFields: 8,
  pageTitle: "Veteran's mailing address",
  schema,
  uiSchema,
};

testPage(pageTestExpectation);

