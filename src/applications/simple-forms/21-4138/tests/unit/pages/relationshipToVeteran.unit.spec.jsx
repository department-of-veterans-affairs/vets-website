import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.identityChapter.pages.relationshipToVeteranPage;

const pageTestExpectation = {
  numberOfWebComponentErrors: 1,
  numberOfWebComponentFields: 1,
  pageTitle: 'Relationship to the Veteran',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
