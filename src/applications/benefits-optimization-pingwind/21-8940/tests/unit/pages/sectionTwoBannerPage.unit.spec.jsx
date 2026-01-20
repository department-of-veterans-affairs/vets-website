import { expect } from 'chai';
import formConfig from '../../../config/form';

const sectionTwoBannerPage =
  formConfig.chapters?.sectionTwoP1Chapter?.pages?.sectionTwoBannerPage;

describe('8940 sectionTwoBannerPage schema basics', () => {
  it('is no longer configured', () => {
    expect(sectionTwoBannerPage).to.be.undefined;
  });
});
