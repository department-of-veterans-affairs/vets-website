import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.contactInformationChapter.pages.contactInformationPage;

const pageConfig = {
  data: {},
  numberOfErrors: 0,
  numberOfFields: 0,
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 2,
  pageTitle: 'Phone and email address',
  schema,
  uiSchema,
};

testPage(pageConfig);
