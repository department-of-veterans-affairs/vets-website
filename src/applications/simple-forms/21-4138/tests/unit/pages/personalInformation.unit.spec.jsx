import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformationChapter.pages.personalInformationPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 3,
  numberOfWebComponentFields: 4,
  pageTitle: 'Name and date of birth',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
