import { expect } from 'chai';
import formConfig from '../../../config/form';

const {
  sectionOneBannerPage,
} = formConfig.chapters.veteranIdInformationChapter.pages;

describe('8940 sectionOneBannerPage schema basics', () => {
  it('has empty properties object', () => {
    expect(sectionOneBannerPage.schema).to.deep.equal({
      type: 'object',
      properties: {},
    });
  });
});
