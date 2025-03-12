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
          pageThree: [{ title: 'Page Three', path: 'page-three' }], // Array case
        },
      },
      chapterTwo: {
        title: 'Chapter Two',
        pages: {
          pageFour: { title: 'Page Four', path: 'page-four/:index' }, // Path with :index
        },
      },
    },
  };

  describe('setupPages', () => {
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
    });
  });

  describe('getPageKeysForReview', () => {
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
    });
  });

  describe('createPageListByChapterAskVa', () => {
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
    });
  });

  describe('getChapterFormConfigAskVa', () => {
    it('should throw error for non-existent chapter', () => {
      const config = { chapters: {} };
      expect(() => getChapterFormConfigAskVa(config, 'nonExistent')).to.throw();
    });

    it('should handle undefined or null formConfig', () => {
      expect(() => getChapterFormConfigAskVa(null, 'chapter')).to.throw();
      expect(() => getChapterFormConfigAskVa(undefined, 'chapter')).to.throw();
    });
  });

  describe('removeDuplicatesByChapterAndPageKey', () => {
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
    });
  });
});
