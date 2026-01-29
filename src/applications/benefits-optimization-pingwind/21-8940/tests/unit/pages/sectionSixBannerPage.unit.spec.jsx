import { expect } from 'chai';
import formConfig from '../../../config/form';

const sectionSixBannerPage =
  formConfig.chapters?.sectionSixChapter?.pages?.sectionSixBannerPage;

describe('8940 sectionSixBannerPage schema basics', () => {
  it('is no longer configured', () => {
    expect(sectionSixBannerPage).to.be.undefined;
  });
});
