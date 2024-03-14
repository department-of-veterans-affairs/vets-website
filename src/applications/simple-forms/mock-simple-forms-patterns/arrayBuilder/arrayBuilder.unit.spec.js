import { expect } from 'chai';
import { YesNoField } from 'platform/forms-system/src/js/web-component-fields';
import arrayBuilderChapter from './components/ArrayBuilderChapter';

describe('arrayBuilderChapter required options tests', () => {
  it('should throw an error if incorrect config is passed', () => {
    const msg =
      'arrayBuilderChapter must include a config function like this `arrayBuilderChapter(pages => { ... })`';
    try {
      arrayBuilderChapter();
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.equal(msg);
    }
    try {
      arrayBuilderChapter({});
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.equal(msg);
    }
  });

  it('should throw an error if uiSchema is not defined with YesNoField', () => {
    try {
      arrayBuilderChapter(pages => ({
        summaryPage: pages.summaryPage({
          title: 'Employment history',
          uiSchema: {},
        }),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include('YesNoField');
    }
  });

  it('should throw an error if options is not provided', () => {
    try {
      arrayBuilderChapter(pages => ({
        summaryPage: pages.summaryPage({
          title: 'Employment history',
          uiSchema: {
            hasEmployment: {
              'ui:webComponentField': YesNoField,
            },
          },
        }),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'arrayBuilderChapter must include an `options` property',
      );
    }
  });

  it('should throw an error if specific options are not provided', () => {
    try {
      arrayBuilderChapter(pages => ({
        options: {},
        summaryPage: pages.summaryPage({
          title: 'Employment history',
          uiSchema: {
            hasEmployment: {
              'ui:webComponentField': YesNoField,
            },
          },
        }),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'arrayBuilderChapter must include `options.arrayPath` property',
      );
    }
    try {
      arrayBuilderChapter(pages => ({
        options: {
          arrayPath: 'employers',
        },
        summaryPage: pages.summaryPage({
          title: 'Employment history',
          uiSchema: {
            hasEmployment: {
              'ui:webComponentField': YesNoField,
            },
          },
        }),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'arrayBuilderChapter must include `options.nounSingular` property',
      );
    }
  });

  it('should throw an error if specific pageOptions are not provided', () => {
    try {
      arrayBuilderChapter(pages => ({
        options: {
          arrayPath: 'employers',
          nounSingular: 'employer',
          nounPlural: 'employers',
          nextChapterPath: '/next-chapter',
        },
        summaryPage: pages.summaryPage({
          title: 'Employment history',
          uiSchema: {
            hasEmployment: {
              'ui:webComponentField': YesNoField,
            },
          },
        }),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'arrayBuilderChapter `pages.summaryPage()` must include',
      );
      expect(e.message).to.include('path: ...');
    }
  });

  it('should pass if everything is provided correctly', () => {
    try {
      arrayBuilderChapter(pages => ({
        options: {
          arrayPath: 'employers',
          nounSingular: 'employer',
          nounPlural: 'employers',
          nextChapterPath: '/next-chapter',
        },
        summaryPage: pages.summaryPage({
          title: 'Employment history',
          path: '/summary',
          uiSchema: {
            hasEmployment: {
              'ui:webComponentField': YesNoField,
            },
          },
          schema: {},
        }),
        firstPage: pages.itemFirstPage({
          title: 'Name of employer',
          path: '/name/:index',
          uiSchema: {},
          schema: {},
        }),
        lastPage: pages.itemLastPage({
          title: 'Address of employer',
          path: '/address/:index',
          uiSchema: {},
          schema: {},
        }),
      }));
    } catch (e) {
      expect(e.message).to.eq('Did not expect error');
    }
  });
});
