import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.sectionTwoP1Chapter.pages.sectionTwoP1;
const pageTitle = 'section two part 1';

// disabilityDescription text field
testNumberOfWebComponentFields(formConfig, schema, uiSchema, 1, pageTitle);
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  1,
  pageTitle,
);

describe('8940 sectionTwoP1 schema basics', () => {
  it('requires disabilityDescription', () => {
    expect(schema.required).to.include('disabilityDescription');
  });
});
