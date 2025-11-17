import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.sectionFiveChapter.pages.additionalRemarks;

const pageTitle = 'additional remarks';

const expectedNumberOfFields = 1;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);

const expectedNumberOfWebComponentFields = 0;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

const expectedNumberOfWebComponentErrors = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);

describe('8940 additionalRemarks page schema basics', () => {
  it('has schema & uiSchema objects', () => {
    expect(schema).to.be.an('object');
    expect(uiSchema).to.be.an('object');
  });

  it('has additionalRemarks field as optional textarea', () => {
    expect(schema.properties.additionalRemarks).to.exist;
    expect(schema.properties.additionalRemarks.type).to.equal('string');
    expect(uiSchema.additionalRemarks['ui:widget']).to.equal('textarea');
  });

  it('has correct textarea options', () => {
    expect(uiSchema.additionalRemarks['ui:options'].rows).to.equal(5);
    expect(uiSchema.additionalRemarks['ui:options'].maxLength).to.equal(1000);
  });
});
