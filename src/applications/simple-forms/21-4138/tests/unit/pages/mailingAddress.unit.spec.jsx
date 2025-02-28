import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.mailingAddressChapter.pages.mailingAddressPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 4,
  numberOfWebComponentFields: 7,
  pageTitle: 'Mailing address',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
