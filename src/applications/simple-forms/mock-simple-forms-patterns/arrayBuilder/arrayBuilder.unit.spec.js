import { expect } from 'chai';
import { YesNoField } from 'platform/forms-system/src/js/web-component-fields';
import {
  arrayBuilderPages,
  getPageAfterPageKey,
} from './components/arrayBuilder';

const validOptions = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
};

describe('arrayBuilderPages required parameters and props tests', () => {
  it('should throw an error if incorrect config is passed', () => {
    const msg =
      'arrayBuilderPages must include options and a callback like this';
    try {
      arrayBuilderPages();
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(msg);
    }
    try {
      arrayBuilderPages({});
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(msg);
    }
    try {
      arrayBuilderPages(null, () => {});
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(msg);
    }
  });

  it('should throw an error if uiSchema is not defined with YesNoField', () => {
    try {
      arrayBuilderPages(validOptions, pageBuilder => ({
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

  it('should throw an error if specific options are not provided', () => {
    try {
      arrayBuilderPages({}, pageBuilder => ({
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
        'arrayBuilderPages options must include `arrayPath` property',
      );
    }
    try {
      arrayBuilderPages(
        {
          arrayPath: 'employers',
        },
        pageBuilder => ({
          summaryPage: pageBuilder.summaryPage({
            title: 'Employment history',
            uiSchema: {
              hasEmployment: {
                'ui:webComponentField': YesNoField,
              },
            },
          }),
        }),
      );
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'arrayBuilderPages options must include `nounSingular` property',
      );
    }
  });

  it('should throw an error if specific pageOptions are not provided', () => {
    try {
      arrayBuilderPages(validOptions, pageBuilder => ({
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
        'arrayBuilderPages `pageBuilder.summaryPage()` must include',
      );
      expect(e.message).to.include('path: ...');
    }
  });

  it('should pass if everything is provided correctly', () => {
    try {
      arrayBuilderPages(validOptions, pageBuilder => ({
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
        firstPage: pageBuilder.itemPage({
          title: 'Name of employer',
          path: '/name/:index',
          uiSchema: {},
          schema: {},
        }),
        lastPage: pageBuilder.itemPage({
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

describe('getPageAfterPageKey', () => {
  it('should get the next page provided a pageKey', () => {
    const mockPageList = [
      {
        pageKey: 'introduction',
        path: '/introduction',
      },
      {
        path: '/mock-custom-page',
        title: 'Mock Custom Page',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Miscellaneous',
        chapterKey: 'miscellaneous',
        pageKey: 'mockCustomPage',
      },
      {
        path: '/array-single-page',
        title: 'Information for Single Page',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Array Single Page',
        chapterKey: 'arraySinglePage',
        pageKey: 'arraySinglePage',
      },
      {
        title: 'Multiple Page Start Title',
        path: '/array-multiple-page-aggregate',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Array Multi-Page Aggregate',
        chapterKey: 'arrayMultiPageAggregate',
        pageKey: 'multiPageStart',
      },
      {
        title: 'Multiple Page Details Title',
        path: '/array-multiple-page-aggregate-details/:index',
        showPagePerItem: true,
        arrayPath: 'exampleArrayData',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Array Multi-Page Aggregate',
        chapterKey: 'arrayMultiPageAggregate',
        pageKey: 'multiPageItem',
      },
      {
        title: 'Array with multiple page builder summary',
        path: '/array-multiple-page-builder-summary',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Array Multi-Page Builder (WIP)',
        chapterKey: 'arrayMultiPageBuilder',
        pageKey: 'multiPageBuilderStart',
      },
      {
        showPagePerItem: true,
        allowPathWithNoItems: true,
        arrayPath: 'employers',
        customPageUsesPagePerItemData: true,
        title: 'Multiple Page Item Title',
        path: '/array-multiple-page-builder-item-page-1/:index',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Array Multi-Page Builder (WIP)',
        chapterKey: 'arrayMultiPageBuilder',
        pageKey: 'multiPageBuilderStepOne',
      },
      {
        showPagePerItem: true,
        allowPathWithNoItems: true,
        arrayPath: 'employers',
        customPageUsesPagePerItemData: true,
        title: 'Multiple Page Item Title',
        path: '/array-multiple-page-builder-item-page-2/:index',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Array Multi-Page Builder (WIP)',
        chapterKey: 'arrayMultiPageBuilder',
        pageKey: 'multiPageBuilderStepTwo',
      },
      {
        pageKey: 'review-and-submit',
        path: '/review-and-submit',
        chapterKey: 'review',
      },
    ];

    let page = getPageAfterPageKey(mockPageList, 'multiPageBuilderStepOne');
    expect(page.pageKey).to.eq('multiPageBuilderStepTwo');

    page = getPageAfterPageKey(mockPageList, 'introduction');
    expect(page.pageKey).to.eq('mockCustomPage');

    page = getPageAfterPageKey(mockPageList, 'review-and-submit');
    expect(page).to.eq(undefined);
  });
});
