import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.contactInformationChapter.pages.contactInformationPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 2,
  numberOfWebComponentFields: 2,
  pageTitle: 'Phone and email address',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
