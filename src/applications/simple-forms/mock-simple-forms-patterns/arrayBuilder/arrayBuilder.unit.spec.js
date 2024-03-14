import { expect } from 'chai';
import { YesNoField } from 'platform/forms-system/src/js/web-component-fields';
import arrayBuilderChapter from './components/ArrayBuilderChapter';

describe('arrayBuilderChapter required options tests', () => {
  it('should throw an error if incorrect config is passed', () => {
    const msg =
      'arrayBuilderChapter must include a config function like this `arrayBuilderChapter(pageBuilder => { ... })`';
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
      arrayBuilderChapter(pageBuilder => ({
        summaryPage: pageBuilder.summaryPage({
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
      arrayBuilderChapter(pageBuilder => ({
        summaryPage: pageBuilder.summaryPage({
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
      arrayBuilderChapter(pageBuilder => ({
        options: {},
        summaryPage: pageBuilder.summaryPage({
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
      arrayBuilderChapter(pageBuilder => ({
        options: {
          arrayPath: 'employers',
        },
        summaryPage: pageBuilder.summaryPage({
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
      arrayBuilderChapter(pageBuilder => ({
        options: {
          arrayPath: 'employers',
          nounSingular: 'employer',
          nounPlural: 'employers',
          nextChapterPath: '/next-chapter',
        },
        summaryPage: pageBuilder.summaryPage({
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
        'arrayBuilderChapter `pageBuilder.summaryPage()` must include',
      );
      expect(e.message).to.include('path: ...');
    }
  });

  it('should pass if everything is provided correctly', () => {
    try {
      arrayBuilderChapter(pageBuilder => ({
        options: {
          arrayPath: 'employers',
          nounSingular: 'employer',
          nounPlural: 'employers',
          nextChapterPath: '/next-chapter',
        },
        summaryPage: pageBuilder.summaryPage({
          title: 'Employment history',
          path: '/summary',
          uiSchema: {
            hasEmployment: {
              'ui:webComponentField': YesNoField,
            },
          },
          schema: {},
        }),
        firstPage: pageBuilder.itemFirstPage({
          title: 'Name of employer',
          path: '/name/:index',
          uiSchema: {},
          schema: {},
        }),
        lastPage: pageBuilder.itemLastPage({
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
