import { expect } from 'chai';
import formConfig from '../../../config/form';

const sectionFourBannerPage =
  formConfig.chapters?.sectionFourChapter?.pages?.sectionFourBannerPage;

describe('8940 sectionFourBannerPage schema basics', () => {
  it('is no longer configured', () => {
    expect(sectionFourBannerPage).to.be.undefined;
  });
});
