import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const { schema, uiSchema } =
  formConfig.chapters.sectionThreeChapter.pages.sectionThree;
const pageTitle = 'employment statement';

// 6 date/number/text fields
testNumberOfWebComponentFields(formConfig, schema, uiSchema, 6, pageTitle);
testNumberOfErrorsOnSubmitForWebComponents(formConfig, schema, uiSchema, 6, pageTitle);

describe('8940 sectionThree schema basics', () => {
  it('requires core employment fields', () => {
    ['disabilityDate','lastWorkedDate','disabledWorkDate','maxYearlyEarnings','yearEarned','occupation'].forEach(f=>
      expect(schema.required).to.include(f));
  });
});
