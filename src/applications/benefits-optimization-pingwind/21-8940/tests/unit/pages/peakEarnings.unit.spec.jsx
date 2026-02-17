import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.sectionThreeChapter.pages.peakEarnings;
const pageTitle = 'peak earnings';

// All three peak earnings inputs render web components
const expectedWebComponents = 3;

testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedWebComponents,
  pageTitle,
);

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedWebComponents,
  pageTitle,
);

describe('8940 peakEarnings schema basics', () => {
  it('requires all peak earnings fields', () => {
    ['maxYearlyEarnings', 'yearEarned', 'occupation'].forEach(field =>
      expect(schema.required).to.include(field),
    );
  });
});
