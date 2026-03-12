import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformationChapter.pages.confirmPersonalInformationPage;

const pageTestExpectation = {
  pageTitle: 'Confirm the personal information we have on file for you',
  schema,
  uiSchema,
};

testPage(pageTestExpectation);
