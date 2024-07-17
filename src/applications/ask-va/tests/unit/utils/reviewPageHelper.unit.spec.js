import { expect } from 'chai';
import formConfig from '../../../config/form';
import { CHAPTER_1, CHAPTER_2, CHAPTER_3 } from '../../../constants';
import { setupPages } from '../../../utils/reviewPageHelper';

describe('reviewPageHelper', () => {
  it('should setupPages for review page', () => {
    const { chapterKeys, chapterTitles } = setupPages(formConfig);

    expect(chapterKeys.length).to.eq(14);
    expect(chapterTitles.includes(CHAPTER_1.CHAPTER_TITLE)).to.be.true;
    expect(chapterTitles.includes(CHAPTER_2.CHAPTER_TITLE)).to.be.true;
    expect(chapterTitles.includes(CHAPTER_3.CHAPTER_TITLE)).to.be.true;
  });
});
