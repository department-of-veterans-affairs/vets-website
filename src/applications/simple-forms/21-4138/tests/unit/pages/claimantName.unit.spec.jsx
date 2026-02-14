import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformationChapter.pages.claimantNamePage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 2,
  numberOfWebComponentFields: 3,
  pageTitle: 'Your name',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);

