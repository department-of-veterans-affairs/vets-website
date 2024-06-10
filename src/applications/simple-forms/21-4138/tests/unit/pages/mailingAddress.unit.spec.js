import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.mailingAddressChapter.pages.mailingAddressPage;

const pageConfig = {
  data: {},
  numberOfErrors: 0,
  numberOfFields: 0,
  numberOfWebComponentErrors: 4,
  numberOfWebComponentFields: 7,
  pageTitle: 'Mailing address',
  schema,
  uiSchema,
};

testPage(pageConfig);
