import { expect } from 'chai';
import {
  createPageListByChapterAskVa,
  getChapterFormConfigAskVa,
  getPageKeysForReview,
  removeDuplicatesByChapterAndPageKey,
  setupPages,
} from '../../utils/reviewPageHelper';

describe('Form Configuration Utility Functions', () => {
  const formConfig = {
    chapters: {
      chapterOne: {
        title: 'Chapter One',
        pages: {
          pageOne: { title: 'Page One', path: 'page-one' },
          pageTwo: { title: 'Page Two', path: 'page-two' },
        },
      },
      chapterTwo: {
        title: 'Chapter Two',
        pages: {
          pageThree: { title: 'Page Three', path: 'page-three' },
        },
      },
    },
  };

  describe('setupPages', () => {
    it('should return chapter keys and titles', () => {
      const { chapterKeys, chapterTitles } = setupPages(formConfig);

      expect(chapterKeys).to.deep.equal(['chapterOne', 'chapterTwo']);
      expect(chapterTitles).to.deep.equal(['Chapter One', 'Chapter Two']);
    });

    it('should return all pages with correct paths', () => {
      const { allPages } = setupPages(formConfig);

      const expectedPages = [
        {
          chapterIndex: 0,
          pageIndex: 0,
          title: 'Page One',
          path: '/page-one',
          key: 'pageOne',
          chapterTitle: 'Chapter One',
          review: undefined,
          editModeOnReviewPage: undefined,
        },
        {
          chapterIndex: 0,
          pageIndex: 1,
          title: 'Page Two',
          path: '/page-two',
          key: 'pageTwo',
          chapterTitle: 'Chapter One',
          review: undefined,
          editModeOnReviewPage: undefined,
        },
        {
          chapterIndex: 1,
          pageIndex: 0,
          title: 'Page Three',
          path: '/page-three',
          key: 'pageThree',
          chapterTitle: 'Chapter Two',
          review: undefined,
          editModeOnReviewPage: undefined,
        },
      ];

      expect(allPages).to.deep.equal(expectedPages);
    });

    it('should find a page from path', () => {
      const { findPageFromPath } = setupPages(formConfig);
      const foundPage = findPageFromPath('/page-two');
      expect(foundPage).to.deep.equal({
        chapterIndex: 0,
        pageIndex: 1,
        title: 'Page Two',
        path: '/page-two',
        key: 'pageTwo',
        chapterTitle: 'Chapter One',
        review: undefined,
        editModeOnReviewPage: undefined,
      });
    });
  });

  describe('getPageKeysForReview', () => {
    it('should return all page keys for review', () => {
      const pageKeys = getPageKeysForReview(formConfig);

      expect(pageKeys).to.deep.equal(['pageOne', 'pageTwo', 'pageThree']);
    });
  });

  describe('createPageListByChapterAskVa', () => {
    it('should move pages to the correct chapter', () => {
      const pagesToMoveConfig = {
        chapterTwo: ['pageOne', 'pageTwo'],
      };

      const {
        pagesByChapter,
        modifiedFormConfig,
      } = createPageListByChapterAskVa(formConfig, pagesToMoveConfig);

      expect(pagesByChapter.chapterTwo).to.have.length(2);
      expect(pagesByChapter.chapterTwo[1].pageKey).to.equal('pageTwo');
      expect(modifiedFormConfig.chapters.chapterTwo.pages.pageOne).to.exist;
    });
  });

  describe('getChapterFormConfigAskVa', () => {
    it('should return the form config for a specific chapter', () => {
      const modifiedFormConfig = {
        chapters: {
          chapterOne: { pages: {} },
          chapterTwo: { pages: {} },
        },
      };

      const chapterConfig = getChapterFormConfigAskVa(
        modifiedFormConfig,
        'chapterTwo',
      );

      expect(chapterConfig).to.deep.equal({ pages: {} });
    });

    it('should throw an error if the chapter does not exist', () => {
      const modifiedFormConfig = {
        chapters: {
          chapterOne: { pages: {} },
        },
      };

      expect(() =>
        getChapterFormConfigAskVa(modifiedFormConfig, 'chapterThree'),
      ).to.throw('Chapter "chapterThree" does not exist in formConfig.');
    });
  });

  describe('removeDuplicatesByChapterAndPageKey', () => {
    it('should remove duplicate pages based on chapterKey and pageKey', () => {
      const pagesArray = [
        { chapterKey: 'chapterOne', pageKey: 'pageOne' },
        { chapterKey: 'chapterOne', pageKey: 'pageOne' },
        { chapterKey: 'chapterTwo', pageKey: 'pageTwo' },
      ];

      const result = removeDuplicatesByChapterAndPageKey(pagesArray);

      expect(result).to.deep.equal([
        { chapterKey: 'chapterOne', pageKey: 'pageOne' },
        { chapterKey: 'chapterTwo', pageKey: 'pageTwo' },
      ]);
    });
  });
});
