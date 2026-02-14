import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranPersonalInformationChapter.pages.veteranNameDobPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 3,
  numberOfWebComponentFields: 4,
  pageTitle: "Veteran's name and date of birth",
  schema,
  uiSchema,
};

testPage(pageTestExpectation);

