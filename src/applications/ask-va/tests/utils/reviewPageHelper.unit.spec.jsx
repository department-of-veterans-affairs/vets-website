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
<<<<<<< HEAD
=======
          pageThree: [{ title: 'Page Three', path: 'page-three' }], // Array case
>>>>>>> main
        },
      },
      chapterTwo: {
        title: 'Chapter Two',
        pages: {
<<<<<<< HEAD
          pageThree: { title: 'Page Three', path: 'page-three' },
=======
          pageFour: { title: 'Page Four', path: 'page-four/:index' }, // Path with :index
>>>>>>> main
        },
      },
    },
  };

  describe('setupPages', () => {
<<<<<<< HEAD
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
=======
    it('should handle empty or undefined formConfig', () => {
      const { chapterKeys, chapterTitles, allPages } = setupPages();
      expect(chapterKeys).to.deep.equal([]);
      expect(chapterTitles).to.deep.equal([]);
      expect(allPages).to.deep.equal([]);

      const nullConfig = setupPages(null);
      expect(nullConfig.chapterKeys).to.deep.equal([]);
      expect(nullConfig.chapterTitles).to.deep.equal([]);
      expect(nullConfig.allPages).to.deep.equal([]);
    });

    it('should handle formConfig with empty chapters', () => {
      const emptyConfig = { chapters: {} };
      const { chapterKeys, chapterTitles, allPages } = setupPages(emptyConfig);
      expect(chapterKeys).to.deep.equal([]);
      expect(chapterTitles).to.deep.equal([]);
      expect(allPages).to.deep.equal([]);
    });

    it('should handle chapter with empty or undefined pages', () => {
      const configWithEmptyPages = {
        chapters: {
          emptyChapter: {
            title: 'Empty Chapter',
            pages: {},
          },
          undefinedPages: {
            title: 'Undefined Pages',
          },
        },
      };
      const { allPages } = setupPages(configWithEmptyPages);
      expect(allPages).to.deep.equal([]);
    });

    it('should handle pages defined as arrays and objects', () => {
      const { allPages } = setupPages(formConfig);
      const pageThree = allPages.find(p => p.title === 'Page Three');
      const pageOne = allPages.find(p => p.title === 'Page One');

      expect(pageThree).to.exist;
      expect(pageThree.path).to.equal('/page-three');
      expect(pageOne).to.exist;
      expect(pageOne.path).to.equal('/page-one');
    });

    it('should handle paths with and without :index', () => {
      const { findPageFromPath } = setupPages(formConfig);

      const normalPage = findPageFromPath('/page-one');
      expect(normalPage.title).to.equal('Page One');

      const indexPage = findPageFromPath('/page-four/1');
      expect(indexPage.title).to.equal('Page Four');

      const nonExistentPage = findPageFromPath('/non-existent');
      expect(nonExistentPage).to.deep.equal({ chapterIndex: 0 });
>>>>>>> main
    });
  });

  describe('getPageKeysForReview', () => {
<<<<<<< HEAD
    it('should return all page keys for review', () => {
      const pageKeys = getPageKeysForReview(formConfig);

      expect(pageKeys).to.deep.equal(['pageOne', 'pageTwo', 'pageThree']);
=======
    it('should handle empty or undefined config', () => {
      const emptyConfig = { chapters: {} };
      expect(getPageKeysForReview(emptyConfig)).to.deep.equal([]);
    });

    it('should handle chapters with empty pages', () => {
      const config = {
        chapters: {
          chapter1: { pages: {} },
          chapter2: { pages: {} },
        },
      };
      expect(getPageKeysForReview(config)).to.deep.equal([]);
    });

    it('should handle valid config with pages', () => {
      expect(getPageKeysForReview(formConfig)).to.deep.equal([
        'pageOne',
        'pageTwo',
        'pageThree',
        'pageFour',
      ]);
>>>>>>> main
    });
  });

  describe('createPageListByChapterAskVa', () => {
<<<<<<< HEAD
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
=======
    const testFormConfig = {
      chapters: {
        sourceChapter: {
          pages: {
            page1: { title: 'Page 1' },
            page2: { title: 'Page 2' },
          },
        },
      },
    };

    it('should handle empty pagesToMoveConfig', () => {
      const result = createPageListByChapterAskVa(testFormConfig, {});
      expect(result.pagesByChapter).to.deep.equal({});
      expect(result.modifiedFormConfig.chapters).to.deep.equal({});
    });

    it('should handle non-existent pages and chapters', () => {
      const pagesToMoveConfig = {
        targetChapter: ['nonExistentPage'],
        nonExistentChapter: ['page1'],
      };
      const result = createPageListByChapterAskVa(
        testFormConfig,
        pagesToMoveConfig,
      );
      expect(result.pagesByChapter.targetChapter).to.deep.equal([]);
      expect(result.pagesByChapter.nonExistentChapter).to.be.an('array');
    });

    it('should handle duplicate pages in source and target', () => {
      const pagesToMoveConfig = {
        targetChapter: ['page1', 'page1', 'page2'],
      };
      const result = createPageListByChapterAskVa(
        testFormConfig,
        pagesToMoveConfig,
      );
      expect(result.pagesByChapter.targetChapter).to.have.lengthOf(2);
      expect(
        result.modifiedFormConfig.chapters.targetChapter.expandedPages,
      ).to.have.lengthOf(2);
>>>>>>> main
    });
  });

  describe('getChapterFormConfigAskVa', () => {
<<<<<<< HEAD
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
=======
    it('should throw error for non-existent chapter', () => {
      const config = { chapters: {} };
      expect(() => getChapterFormConfigAskVa(config, 'nonExistent')).to.throw();
    });

    it('should handle undefined or null formConfig', () => {
      expect(() => getChapterFormConfigAskVa(null, 'chapter')).to.throw();
      expect(() => getChapterFormConfigAskVa(undefined, 'chapter')).to.throw();
>>>>>>> main
    });
  });

  describe('removeDuplicatesByChapterAndPageKey', () => {
<<<<<<< HEAD
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
=======
    it('should handle empty array', () => {
      expect(removeDuplicatesByChapterAndPageKey([])).to.deep.equal([]);
    });

    it('should handle array with undefined or missing keys', () => {
      const array = [
        { chapterKey: 'ch1', pageKey: 'page1' },
        { chapterKey: 'ch1' }, // missing pageKey
        { pageKey: 'page2' }, // missing chapterKey
        { chapterKey: 'ch2', pageKey: 'page2' },
      ];
      const result = removeDuplicatesByChapterAndPageKey(array);
      expect(result).to.have.lengthOf(4); // Function keeps items with missing keys
    });

    it('should remove exact duplicates', () => {
      const array = [
        { chapterKey: 'ch1', pageKey: 'page1' },
        { chapterKey: 'ch1', pageKey: 'page1' },
        { chapterKey: 'ch2', pageKey: 'page2' },
      ];
      const result = removeDuplicatesByChapterAndPageKey(array);
      expect(result).to.have.lengthOf(2);
>>>>>>> main
    });
  });
});
