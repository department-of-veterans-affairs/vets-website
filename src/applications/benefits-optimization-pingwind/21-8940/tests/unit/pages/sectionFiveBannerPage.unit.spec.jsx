import { expect } from 'chai';
import formConfig from '../../../config/form';

const sectionFiveBannerPage =
  formConfig.chapters?.sectionFiveChapter?.pages?.sectionFiveBannerPage;

describe('8940 sectionFiveBannerPage schema basics', () => {
  it('is no longer configured', () => {
    expect(sectionFiveBannerPage).to.be.undefined;
  });
});
