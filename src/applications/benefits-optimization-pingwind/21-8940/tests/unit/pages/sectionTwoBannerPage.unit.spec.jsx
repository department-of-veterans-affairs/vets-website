import { expect } from 'chai';
import formConfig from '../../../config/form';

const { sectionTwoBannerPage } = formConfig.chapters.sectionTwoP1Chapter.pages;

describe('8940 sectionTwoBannerPage schema basics', () => {
  it('has empty properties object', () => {
    expect(sectionTwoBannerPage.schema).to.deep.equal({
      type: 'object',
      properties: {},
    });
  });
});
