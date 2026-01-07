import { expect } from 'chai';
import formConfig from '../../../config/form';

const { sectionFiveBannerPage } = formConfig.chapters.sectionFiveChapter.pages;

describe('8940 sectionFiveBannerPage schema basics', () => {
  it('has empty properties object', () => {
    expect(sectionFiveBannerPage.schema).to.deep.equal({
      type: 'object',
      properties: {},
    });
  });
});
