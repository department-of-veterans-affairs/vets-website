import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranPersonalInformationChapter.pages.veteranIdentificationInformationPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 2,
  pageTitle: "Veteran's identification information",
  schema,
  uiSchema,
};

testPage(pageTestExpectation);

