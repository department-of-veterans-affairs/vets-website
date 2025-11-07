import { expect } from 'chai';
import formConfig from '../../../config/form';

const { sectionSixBannerPage } = formConfig.chapters.sectionSixChapter.pages;

describe('8940 sectionSixBannerPage schema basics', () => {
  it('has empty properties object', () => {
    expect(sectionSixBannerPage.schema).to.deep.equal({
      type: 'object',
      properties: {},
    });
  });
});
