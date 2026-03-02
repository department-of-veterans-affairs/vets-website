import { expect } from 'chai';
import formConfig from '../../../config/form';

const sectionThreeBannerPage =
  formConfig.chapters?.sectionThreeChapter?.pages?.sectionThreeBannerPage;

describe('8940 sectionThreeBannerPage schema basics', () => {
  it('is no longer configured', () => {
    expect(sectionThreeBannerPage).to.be.undefined;
  });
});
