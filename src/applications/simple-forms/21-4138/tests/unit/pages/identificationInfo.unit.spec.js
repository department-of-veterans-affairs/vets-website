import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.identificationChapter.pages.identificationInformationPage;

const pageConfig = {
  data: {},
  numberOfErrors: 0,
  numberOfFields: 0,
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 2,
  pageTitle: 'Identification information',
  schema,
  uiSchema,
};

testPage(pageConfig);
