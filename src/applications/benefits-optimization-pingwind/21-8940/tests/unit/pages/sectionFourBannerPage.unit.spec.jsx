import { expect } from 'chai';
import formConfig from '../../../config/form';

const { sectionFourBannerPage } = formConfig.chapters.sectionFourChapter.pages;

describe('8940 sectionFourBannerPage schema basics', () => {
  it('has empty properties object', () => {
    expect(sectionFourBannerPage.schema).to.deep.equal({
      type: 'object',
      properties: {},
    });
  });
});
