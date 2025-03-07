import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.identificationChapter.pages.identificationInformationPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 2,
  pageTitle: 'Identification information',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
