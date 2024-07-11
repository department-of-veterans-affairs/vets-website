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

const validIntroPage = {
  title: 'Employment history',
  path: 'employers-intro',
  uiSchema: {},
  schema: {},
};

const validSummaryPage = {
  title: 'Employment history',
  path: 'employers-summary',
  uiSchema: {
    hasEmployment: validYesNoPattern,
  },
  schema: {},
};

const validFirstPage = {
  title: 'Name of employer',
  path: 'employers/name/:index',
  uiSchema: {},
  schema: {},
};

const validLastPage = {
  title: 'Address of employer',
  path: 'employers/address/:index',
  uiSchema: {},
  schema: {},
};

const validPages = pageBuilder => ({
  summaryPage: pageBuilder.summaryPage(validSummaryPage),
  firstPage: pageBuilder.itemPage(validFirstPage),
  lastPage: pageBuilder.itemPage(validLastPage),
});

const validPagesWithIntro = pageBuilder => ({
  introPage: pageBuilder.introPage(validIntroPage),
  summaryPage: pageBuilder.summaryPage(validSummaryPage),
  firstPage: pageBuilder.itemPage(validFirstPage),
  lastPage: pageBuilder.itemPage(validLastPage),
});

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
    title: 'Employers',
    path: '/employers-intro',
    uiSchema: {},
    schema: {},
    chapterTitle: 'Employers',
    chapterKey: 'arrayMultiPageBuilder',
    pageKey: 'introPage',
  },
  {
    title: 'Array with multiple page builder summary',
    path: '/employers-summary',
    uiSchema: {},
    schema: {},
    chapterTitle: 'Array Multi-Page Builder (WIP)',
    chapterKey: 'arrayMultiPageBuilder',
    pageKey: 'summaryPage',
  },
  {
    showPagePerItem: true,
    allowPathWithNoItems: true,
    arrayPath: 'employers',
    customPageUsesPagePerItemData: true,
    title: 'Multiple Page Item Title',
    path: '/employers/name/:index',
    uiSchema: {},
    schema: {},
    chapterTitle: 'Array Multi-Page Builder (WIP)',
    chapterKey: 'arrayMultiPageBuilder',
    pageKey: 'firstPage',
  },
  {
    showPagePerItem: true,
    allowPathWithNoItems: true,
    arrayPath: 'employers',
    customPageUsesPagePerItemData: true,
    title: 'Multiple Page Item Title',
    path: '/employers/address/:index',
    uiSchema: {},
    schema: {},
    chapterTitle: 'Array Multi-Page Builder (WIP)',
    chapterKey: 'arrayMultiPageBuilder',
    pageKey: 'lastPage',
  },
  {
    pageKey: 'review-and-submit',
    path: '/review-and-submit',
    chapterKey: 'review',
  },
];

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
    } catch (e) {
      expect(e.message).to.include('arrayBuilderPages options must include');
      expect(e.message).to.include('required');
    }
  });

  it('should throw an error if uiSchema is not defined with arrayBuilderYesNoUI', () => {
    try {
      arrayBuilderPages(validOptions, pageBuilder => ({
        summaryPage: pageBuilder.summaryPage({
          title: 'Employment history',
          uiSchema: {},
        }),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include('arrayBuilderYesNoUI');
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

  it('should throw error if intro page is not defined first', () => {
    try {
      arrayBuilderPages(validOptions, pageBuilder => ({
        summaryPage: pageBuilder.summaryPage(validSummaryPage),
        introPage: pageBuilder.introPage(validIntroPage),
        firstPage: pageBuilder.itemPage(validFirstPage),
        lastPage: pageBuilder.itemPage(validLastPage),
      }));
    } catch (e) {
      expect(e.message).to.include('must be first and defined only once');
    }
  });

  it('should include a summary page', () => {
    try {
      arrayBuilderPages(validOptions, pageBuilder => ({
        introPage: pageBuilder.introPage(validIntroPage),
        firstPage: pageBuilder.itemPage(validFirstPage),
        lastPage: pageBuilder.itemPage(validLastPage),
      }));
    } catch (e) {
      expect(e.message).to.include('must include a summary page');
    }
  });

  it('should throw error if required is not passed', () => {
    try {
      arrayBuilderPages({ ...validOptions, required: undefined }, validPages);
    } catch (e) {
      expect(e.message).to.include('arrayBuilderPages options must include');
      expect(e.message).to.include('required');
    }
  });

  it('should pass if everything is provided correctly', () => {
    try {
      arrayBuilderPages(validOptions, validPages);
    } catch (e) {
      expect(e.message).to.eq('Did not expect error');
    }
  });

  it('should navigate forward correctly on the intro page', () => {
    const goPath = sinon.spy();
    const goNextPath = sinon.spy();
    const pages = arrayBuilderPages(validOptions, validPagesWithIntro);

    let mockFormData = {
      hasEmployment: true,
      employers: [
        {
          name: 'test',
          address: '123 test st',
        },
      ],
    };

    let { introPage } = pages;
    introPage.onNavForward({
      goPath,
      goNextPath,
      formData: mockFormData,
    });
    expect(goPath.args[0][0]).to.eql('employers-summary');

    mockFormData = {
      hasEmployment: true,
      employers: [],
    };

    introPage = pages.introPage;
    introPage.onNavForward({
      goPath,
      goNextPath,
      formData: mockFormData,
    });
    expect(goPath.args[1][0]).to.eql('employers/name/0?add=true');
  });

  it('should navigate forward correctly on the summary page', () => {
    const goPath = sinon.spy();
    const pages = arrayBuilderPages(validOptions, validPages);

    let mockFormData = {
      hasEmployment: true,
      employers: [
        {
          name: 'test',
          address: '123 test st',
        },
      ],
    };

    const { summaryPage } = pages;
    summaryPage.onNavForward({
      goPath,
      formData: mockFormData,
      pageList: mockPageList,
    });
    expect(goPath.args[0][0]).to.eql('employers/name/1?add=true');

    mockFormData = {
      hasEmployment: false,
      employers: [
        {
          name: 'test',
          address: '123 test st',
        },
      ],
    };

    summaryPage.onNavForward({
      goPath,
      formData: mockFormData,
      pageList: mockPageList,
    });
    expect(goPath.args[1][0]).to.eql('/review-and-submit');
  });

  it('should navigate forward correctly on the last item page', () => {
    const goPath = sinon.spy();
    const pages = arrayBuilderPages(validOptions, validPages);

    const { lastPage } = pages;
    lastPage.onNavForward({
      goPath,
      urlParams: { add: true },
      pathname: '/employers/address/0',
    });
    expect(goPath.args[0][0]).to.eql('employers-summary');

    lastPage.onNavForward({
      goPath,
      urlParams: { edit: true },
      pathname: '/employers/address/0',
    });
    expect(goPath.args[1][0]).to.eql('employers-summary?updated=employer-0');

    lastPage.onNavForward({
      goPath,
      urlParams: { edit: true, review: true },
      pathname: '/employers/address/0',
    });
    expect(goPath.args[2][0]).to.eql('review-and-submit?updated=employer-0');
  });
});

describe('getPageAfterPageKey', () => {
  it('should get the next page provided a pageKey', () => {
    let page = getPageAfterPageKey(mockPageList, 'firstPage');
    expect(page.pageKey).to.eq('lastPage');

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
