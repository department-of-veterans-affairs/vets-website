import { expect } from 'chai';
import formConfig from '../../../config/form';

const { schema, uiSchema } =
  formConfig.chapters.sectionFiveChapter.pages.additionalRemarks;

describe('8940 additionalRemarks page schema basics', () => {
  it('has schema & uiSchema objects', () => {
    expect(schema).to.be.an('object');
    expect(uiSchema).to.be.an('object');
  });
});
