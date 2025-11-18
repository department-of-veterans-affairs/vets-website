import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.employmentHistoryChapter.pages.currentIncome;

const pageTitle = 'current income';
const numberOfWebComponentFields = 2;

testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

describe('8940 currentIncome schema basics', () => {
  it('requires both current income fields', () => {
    ['totalIncome', 'monthlyIncome'].forEach(field =>
      expect(schema.required).to.include(field),
    );
  });
});
