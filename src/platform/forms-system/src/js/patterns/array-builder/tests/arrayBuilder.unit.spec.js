import sinon from 'sinon';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { YesNoField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages, getPageAfterPageKey } from '../arrayBuilder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoUI,
} from '../../../web-component-patterns/arrayBuilderPatterns';
import * as helpers from '../helpers';

const validOptions = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true,
};

const validYesNoPattern = arrayBuilderYesNoUI({
  arrayPath: 'employers',
  nounSingular: 'employer',
  required: false,
});

const validPages = pageBuilder => ({
  summaryPage: pageBuilder.summaryPage({
    title: 'Employment history',
    path: '/summary',
    uiSchema: {
      hasEmployment: validYesNoPattern,
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
});

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

  it('should throw an error if incorrect review path', () => {
    try {
      arrayBuilderPages({ ...validOptions, reviewPath: '/review' }, validPages);
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include('reviewPath should not start with a `/`');
    }
  });

  it('should throw an error if required is not passed', () => {
    try {
      arrayBuilderPages({ ...validOptions, required: undefined }, validPages);
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include('must include a `required`');
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

  it('should throw an error if itemPage not provided', () => {
    try {
      arrayBuilderPages(validOptions, pageBuilder => ({
        summaryPage: pageBuilder.summaryPage({
          title: 'Employment history',
          uiSchema: {
            hasEmployment: validYesNoPattern,
          },
        }),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include('must include at least one item page');
    }
  });

  it('should throw an error if summaryPage is not defined before itemPage', () => {
    try {
      arrayBuilderPages(validOptions, pageBuilder => ({
        itemPage: pageBuilder.itemPage({
          path: 'test/:index',
          title: 'title',
          uiSchema: {},
          schema: {},
        }),
        summaryPage: pageBuilder.summaryPage({
          title: 'Employment history',
          uiSchema: {
            hasEmployment: validYesNoPattern,
          },
        }),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        '`pageBuilder.summaryPage` must be defined only once and be defined before the item pages',
      );
    }
  });

  it('should throw an error if specific pageOptions are not provided', () => {
    try {
      arrayBuilderPages(validOptions, pageBuilder => ({
        summaryPage: pageBuilder.summaryPage({
          title: 'Employment history',
          uiSchema: {
            hasEmployment: validYesNoPattern,
          },
        }),
        itemPage: pageBuilder.itemPage({
          path: 'test/:index',
          title: 'title',
          uiSchema: {},
          schema: {},
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
      arrayBuilderPages(validOptions, validPages);
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

describe('arrayBuilderPatterns', () => {
  let getArrayUrlSearchParamsStub;

  function stubUrlParams(str) {
    getArrayUrlSearchParamsStub = sinon
      .stub(helpers, 'getArrayUrlSearchParams')
      .returns(new URLSearchParams(str));
  }

  afterEach(() => {
    if (getArrayUrlSearchParamsStub) {
      getArrayUrlSearchParamsStub.restore();
      getArrayUrlSearchParamsStub = null;
    }
  });

  const titleOptions = {
    title: 'Name and address of employer',
    nounSingular: 'employer',
  };

  it('should display correctly for URL param "add"', () => {
    stubUrlParams('?add=true');
    const uiSchema = arrayBuilderItemFirstPageTitleUI(titleOptions);
    const { getByText } = render(uiSchema['ui:title']());
    expect(getByText('Name and address of employer')).to.exist;
  });

  it('should display correctly for URL param "edit"', () => {
    stubUrlParams('?edit=true');
    const uiSchema = arrayBuilderItemFirstPageTitleUI(titleOptions);
    const { getByText } = render(uiSchema['ui:title']());
    expect(getByText('Edit name and address of employer')).to.exist;
  });

  it('should display correctly for URL param "edit"', () => {
    stubUrlParams('?add=true&removedAllWarn=true');
    const uiSchema = arrayBuilderItemFirstPageTitleUI(titleOptions);
    const { queryByText } = render(uiSchema['ui:title']());
    expect(
      queryByText(
        'You must add at least one employer for us to process this form.',
      ),
    ).to.exist;
  });

  it('should display correctly for URL param "edit"', () => {
    stubUrlParams('?edit=true&removedAllWarn=true');
    const uiSchema = arrayBuilderItemFirstPageTitleUI(titleOptions);
    const { queryByText } = render(uiSchema['ui:title']());
    expect(
      queryByText(
        'You must add at least one employer for us to process this form.',
      ),
    ).to.not.exist;
  });
});
