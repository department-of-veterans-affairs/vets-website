import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformationChapter.pages.personalInformationPage;

const pageConfig = {
  data: {},
  numberOfErrors: 0,
  numberOfFields: 0,
  numberOfWebComponentErrors: 3,
  numberOfWebComponentFields: 4,
  pageTitle: 'Name and date of birth',
  schema,
  uiSchema,
};

testPage(pageConfig);
