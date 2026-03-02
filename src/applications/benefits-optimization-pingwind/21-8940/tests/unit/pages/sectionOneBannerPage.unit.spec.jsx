import { expect } from 'chai';
import formConfig from '../../../config/form';

const sectionOneBannerPage =
  formConfig.chapters?.veteranIdInformationChapter?.pages?.sectionOneBannerPage;

describe('8940 sectionOneBannerPage schema basics', () => {
  it('is no longer configured', () => {
    expect(sectionOneBannerPage).to.be.undefined;
  });
});
