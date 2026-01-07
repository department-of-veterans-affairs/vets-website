import { expect } from 'chai';
import formConfig from '../../../config/form';

const {
  sectionThreeBannerPage,
} = formConfig.chapters.sectionThreeChapter.pages;

describe('8940 sectionThreeBannerPage schema basics', () => {
  it('has empty properties object', () => {
    expect(sectionThreeBannerPage.schema).to.deep.equal({
      type: 'object',
      properties: {},
    });
  });
});
