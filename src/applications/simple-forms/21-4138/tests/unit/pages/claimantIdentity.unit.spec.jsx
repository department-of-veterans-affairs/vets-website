import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.identityChapter.pages.claimantIdentityPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 1,
  pageTitle: 'Your identity',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
