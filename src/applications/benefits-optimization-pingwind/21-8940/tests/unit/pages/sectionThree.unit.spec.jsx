import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const { schema, uiSchema } =
  formConfig.chapters.sectionThreeChapter.pages.sectionThree;
const pageTitle = 'employment statement';

// Dates render through a custom field that does not register as a web component in the shared helpers
testNumberOfWebComponentFields(formConfig, schema, uiSchema, 0, pageTitle);
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  0,
  pageTitle,
);

describe('8940 sectionThree schema basics', () => {
  it('requires core employment fields', () => {
    ['disabilityDate', 'lastWorkedDate', 'disabledWorkDate'].forEach(f =>
      expect(schema.required).to.include(f),
    );
  });
});
