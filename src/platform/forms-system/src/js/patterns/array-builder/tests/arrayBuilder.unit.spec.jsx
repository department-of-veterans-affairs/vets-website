import sinon from 'sinon-v20';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { YesNoField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages, getPageAfterPageKey } from '../arrayBuilder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoUI,
} from '../../../web-component-patterns/arrayBuilderPatterns';
import * as helpers from '../helpers';

const validOptionsRequiredFlow = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true,
};

const validOptionsOptionalFlow = {
  ...validOptionsRequiredFlow,
  required: false,
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

const validPageA = {
  title: 'Name of employer',
  path: 'employers/pageA/:index',
  uiSchema: {},
  schema: {},
};

const validPageB = {
  title: 'Address of employer',
  path: 'employers/pageB/:index',
  uiSchema: {},
  schema: {},
};

const validPages = pageBuilder => ({
  summaryPage: pageBuilder.summaryPage(validSummaryPage),
  pageA: pageBuilder.itemPage(validPageA),
  pageB: pageBuilder.itemPage(validPageB),
});

const validPagesWithIntro = pageBuilder => ({
  introPage: pageBuilder.introPage(validIntroPage),
  summaryPage: pageBuilder.summaryPage(validSummaryPage),
  pageA: pageBuilder.itemPage(validPageA),
  pageB: pageBuilder.itemPage(validPageB),
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
    path: '/employers/pageA/:index',
    uiSchema: {},
    schema: {},
    chapterTitle: 'Array Multi-Page Builder (WIP)',
    chapterKey: 'arrayMultiPageBuilder',
    pageKey: 'pageA',
  },
  {
    showPagePerItem: true,
    allowPathWithNoItems: true,
    arrayPath: 'employers',
    customPageUsesPagePerItemData: true,
    title: 'Multiple Page Item Title',
    path: '/employers/pageB/:index',
    uiSchema: {},
    schema: {},
    chapterTitle: 'Array Multi-Page Builder (WIP)',
    chapterKey: 'arrayMultiPageBuilder',
    pageKey: 'pageB',
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

  it('should throw an error if incorrect path', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        summaryPage: pageBuilder.summaryPage({
          ...validSummaryPage,
          path: '/summary',
        }),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
      expect('Expected path to fail validation and be caught').to.be.false;
    } catch (e) {
      expect(e.message).to.include('path');
      expect(e.message).to.include('should not start with a `/`');
    }
  });

  it('should throw an error if incorrect review path', () => {
    try {
      arrayBuilderPages(
        { ...validOptionsRequiredFlow, reviewPath: '/review' },
        validPages,
      );
      expect('Expected path to fail validation and be caught').to.be.false;
    } catch (e) {
      expect(e.message).to.include('reviewPath');
      expect(e.message).to.include('should not start with a `/`');
    }
  });

  it('should throw an error if required is not passed', () => {
    try {
      arrayBuilderPages(validOptionsOptionalFlow, validPages);
    } catch (e) {
      expect(e.message).to.include('arrayBuilderPages options must include');
      expect(e.message).to.include('required');
    }
  });

  it('should throw an error if uiSchema is not defined with arrayBuilderYesNoUI', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
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

  it('should not throw an error if uiSchema is not defined as long as we have a link or button', () => {
    const options = {
      ...validOptionsRequiredFlow,
      useLinkInsteadOfYesNo: true,
    };
    try {
      arrayBuilderPages(options, pageBuilder => ({
        summaryPage: pageBuilder.summaryPage({
          title: 'Employment history',
          path: 'employers-summary',
        }),
        itemPage: pageBuilder.itemPage({
          title: 'Name of employer',
          path: 'employers/pageA/:index',
          uiSchema: {},
          schema: {},
        }),
      }));
      expect(true).to.be.true;
    } catch (e) {
      expect(
        'Error should not be thrown for missing uiSchema when using link',
      ).to.eq(e.message);
    }
  });

  it("it should throw an error if a user tries to use uiSchema properties but we aren't using it", () => {
    const options = {
      ...validOptionsRequiredFlow,
      useLinkInsteadOfYesNo: true,
    };
    try {
      arrayBuilderPages(options, pageBuilder => ({
        summaryPage: pageBuilder.summaryPage({
          title: 'Employment history',
          path: 'employers-summary',
          uiSchema: {
            test: {
              'ui:title': 'Hello',
            },
          },
          schema: {
            type: 'object',
            properties: {
              test: {
                type: 'string',
              },
            },
          },
        }),
        itemPage: pageBuilder.itemPage({
          title: 'Name of employer',
          path: 'employers/pageA/:index',
          uiSchema: {},
          schema: {},
        }),
      }));
      expect(
        'Expected error to be thrown when using useLinkInsteadOfYesNo with uiSchema',
      ).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'does not currently support using `uiSchema` or `schema` properties when using option `useLinkInsteadOfYesNo`',
      );
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
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
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
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
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
        '`pageBuilder.summaryPage` must come before item pages',
      );
    }
  });

  it('should throw an error if specific pageOptions are not provided', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
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
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        summaryPage: pageBuilder.summaryPage(validSummaryPage),
        introPage: pageBuilder.introPage(validIntroPage),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
    } catch (e) {
      expect(e.message).to.include(
        'must be defined first, before other arrayBuilder pages',
      );
    }
  });

  it('should include a summary page', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        introPage: pageBuilder.introPage(validIntroPage),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
    } catch (e) {
      expect(e.message).to.include(
        'arrayBuilderPages must include a summary page with `pageBuilder.summaryPage',
      );
    }
  });

  it('should throw an error if more than one summary page exists without depends', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        introPage: pageBuilder.introPage(validIntroPage),
        summaryPageA: pageBuilder.summaryPage({
          ...validSummaryPage,
          path: 'employers-summary-a',
        }),
        summaryPageB: pageBuilder.summaryPage({
          ...validSummaryPage,
          path: 'employers-summary-b',
        }),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'Only one `pageBuilder.summaryPage` is allowed',
      );
      expect(e.message).to.include(
        'must use `depends` to make them mutually exclusive',
      );
    }
  });

  it('should allow a single summary page to use depends', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        introPage: pageBuilder.introPage(validIntroPage),
        summaryPage: pageBuilder.summaryPage({
          ...validSummaryPage,
          depends: () => true,
        }),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
    } catch (e) {
      expect(e.message).to.eq('Did not expect error');
    }
  });

  it('should allow multiple summary pages if all have depends', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        introPage: pageBuilder.introPage(validIntroPage),
        summaryPageA: pageBuilder.summaryPage({
          ...validSummaryPage,
          path: 'employers-summary-a',
          depends: formData => formData.employmentType === 'civilian',
        }),
        summaryPageB: pageBuilder.summaryPage({
          ...validSummaryPage,
          path: 'employers-summary-b',
          depends: formData => formData.employmentType === 'military',
        }),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
    } catch (e) {
      expect(e.message).to.eq('Did not expect error');
    }
  });

  it('should throw an error if multiple summary pages have depends on some but not all', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        introPage: pageBuilder.introPage(validIntroPage),
        summaryPageA: pageBuilder.summaryPage({
          ...validSummaryPage,
          path: 'employers-summary-a',
          depends: formData => formData.employmentType === 'civilian',
        }),
        summaryPageB: pageBuilder.summaryPage({
          ...validSummaryPage,
          path: 'employers-summary-b',
        }),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'Only one `pageBuilder.summaryPage` is allowed',
      );
      expect(e.message).to.include(
        'must use `depends` to make them mutually exclusive',
      );
    }
  });

  it('should allow a single intro page to use depends', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        introPage: pageBuilder.introPage({
          ...validIntroPage,
          depends: () => true,
        }),
        summaryPage: pageBuilder.summaryPage(validSummaryPage),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
    } catch (e) {
      expect(e.message).to.eq('Did not expect error');
    }
  });

  it('should throw an error if multiple intro pages exist without depends', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        introPageA: pageBuilder.introPage({
          ...validIntroPage,
          path: 'employers-intro-a',
        }),
        introPageB: pageBuilder.introPage({
          ...validIntroPage,
          path: 'employers-intro-b',
        }),
        summaryPage: pageBuilder.summaryPage(validSummaryPage),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'Only one `pageBuilder.introPage` is allowed',
      );
      expect(e.message).to.include(
        'must use `depends` to make them mutually exclusive',
      );
    }
  });

  it('should allow multiple intro pages if all have depends', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        introPageA: pageBuilder.introPage({
          ...validIntroPage,
          path: 'employers-intro-a',
          depends: formData => formData.employmentType === 'civilian',
        }),
        introPageB: pageBuilder.introPage({
          ...validIntroPage,
          path: 'employers-intro-b',
          depends: formData => formData.employmentType === 'military',
        }),
        summaryPage: pageBuilder.summaryPage(validSummaryPage),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
    } catch (e) {
      expect(e.message).to.eq('Did not expect error');
    }
  });

  it('should throw an error if multiple intro pages have depends on some but not all', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, pageBuilder => ({
        introPageA: pageBuilder.introPage({
          ...validIntroPage,
          path: 'employers-intro-a',
          depends: formData => formData.employmentType === 'civilian',
        }),
        introPageB: pageBuilder.introPage({
          ...validIntroPage,
          path: 'employers-intro-b',
        }),
        summaryPage: pageBuilder.summaryPage(validSummaryPage),
        pageA: pageBuilder.itemPage(validPageA),
        pageB: pageBuilder.itemPage(validPageB),
      }));
      expect(true).to.be.false;
    } catch (e) {
      expect(e.message).to.include(
        'Only one `pageBuilder.introPage` is allowed',
      );
      expect(e.message).to.include(
        'must use `depends` to make them mutually exclusive',
      );
    }
  });

  it('should throw error if required is not passed', () => {
    try {
      arrayBuilderPages(validOptionsOptionalFlow, validPages);
    } catch (e) {
      expect(e.message).to.include('arrayBuilderPages options must include');
      expect(e.message).to.include('required');
    }
  });

  it('should pass if everything is provided correctly', () => {
    try {
      arrayBuilderPages(validOptionsRequiredFlow, validPages);
    } catch (e) {
      expect(e.message).to.eq('Did not expect error');
    }
  });

  it('should navigate forward correctly on the intro page', () => {
    const goPath = sinon.spy();
    const goNextPath = sinon.spy();
    const pages = arrayBuilderPages(
      validOptionsRequiredFlow,
      validPagesWithIntro,
    );

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
    expect(goPath.args[1][0]).to.eql('employers/pageA/0?add=true');
  });

  it('should navigate forward correctly on the summary page', () => {
    const goPath = sinon.spy();
    const pages = arrayBuilderPages(validOptionsRequiredFlow, validPages);

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
    expect(goPath.args[0][0]).to.eql('employers/pageA/1?add=true');

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
    const pages = arrayBuilderPages(validOptionsRequiredFlow, validPages);

    const { pageB } = pages;
    pageB.onNavForward({
      goPath,
      urlParams: { add: true },
      pathname: '/employers/pageB/0',
    });
    expect(goPath.args[0][0]).to.eql('employers-summary');

    pageB.onNavForward({
      goPath,
      urlParams: { edit: true },
      pathname: '/employers/pageB/0',
    });
    expect(goPath.args[1][0]).to.eql('employers-summary?updated=employers-0');

    pageB.onNavForward({
      goPath,
      urlParams: { edit: true, review: true },
      pathname: '/employers/pageB/0',
    });
    expect(goPath.args[2][0]).to.eql('review-and-submit?updated=employers-0');
  });
});

describe('arrayBuilderPages maxItems (function vs number)', () => {
  let maxItemsFnStub;

  afterEach(() => {
    if (maxItemsFnStub) {
      maxItemsFnStub.restore();
      maxItemsFnStub = null;
    }
  });

  it('should attach array-level updateSchema and omits static maxItems when `maxItems` is a function', () => {
    const maxItemsFnInput = fd => (fd?.employers?.length ?? 0) + 1;
    const options = {
      ...validOptionsRequiredFlow,
      maxItems: maxItemsFnInput,
    };

    // Stub helpers.maxItemsFn to ensure we control the return
    maxItemsFnStub = sinon
      .stub(helpers, 'maxItemsFn')
      .callsFake((fn, formData) => {
        expect(fn).to.equal(maxItemsFnInput);
        expect(formData).to.deep.equal({
          hasEmployment: true,
          employers: [{}, {}],
        });
        return 5;
      });

    const pages = arrayBuilderPages(options, validPages);
    const { pageA } = pages;

    // Assert: schema omits static maxItems (because it’s a function)
    const arraySchema = pageA.schema.properties.employers;
    expect(arraySchema).to.exist;
    expect(arraySchema.maxItems).to.equal(undefined);

    // Assert: array-level updateSchema is attached
    const update = pageA.uiSchema.employers['ui:options']?.updateSchema;
    expect(update).to.be.a('function');

    // Act: run the updater
    const resultSchema = update(
      { hasEmployment: true, employers: [{}, {}] },
      pageA.schema,
      pageA.uiSchema,
    );

    // Assert: updater writes numeric maxItems
    const updatedArraySchema = resultSchema.properties.employers;
    expect(updatedArraySchema.maxItems).to.equal(5);
    sinon.assert.calledOnce(maxItemsFnStub);
  });

  it('should write static `maxItems` and omit array-level `updateSchema` when `maxItems` is a number', () => {
    const options = {
      ...validOptionsRequiredFlow,
      maxItems: 7,
    };

    const pages = arrayBuilderPages(options, validPages);
    const { pageA } = pages;

    // Static schema includes maxItems
    const arraySchema = pageA.schema.properties.employers;
    expect(arraySchema.maxItems).to.equal(7);

    // No array-level updater
    const uiOpts = pageA.uiSchema.employers['ui:options'];
    expect(uiOpts && uiOpts.updateSchema).to.equal(undefined);
  });

  it('should not set `maxItems` if `maxItemsFn` returns a non-finite value', () => {
    const options = {
      ...validOptionsRequiredFlow,
      maxItems: () => NaN,
    };

    maxItemsFnStub = sinon.stub(helpers, 'maxItemsFn').returns(NaN);

    const pages = arrayBuilderPages(options, validPages);
    const { pageA } = pages;

    // No static maxItems when function
    const arraySchema = pageA.schema.properties.employers;
    expect(arraySchema.maxItems).to.equal(undefined);

    // Updater exists
    const update = pageA.uiSchema.employers['ui:options']?.updateSchema;
    expect(update).to.be.a('function');

    // Run updater
    const resultSchema = update(
      { hasEmployment: true, employers: [{}] },
      pageA.schema,
      pageA.uiSchema,
    );

    // Since evaluated value is non-finite, updater should NOT write maxItems
    const updatedArraySchema = resultSchema.properties.employers;
    expect(updatedArraySchema.maxItems).to.equal(undefined);
  });
});

describe('getPageAfterPageKey', () => {
  it('should get the next page provided a pageKey', () => {
    let page = getPageAfterPageKey(mockPageList, 'pageA');
    expect(page.pageKey).to.eq('pageB');

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

describe('depends navigations', () => {
  const setupPages = ({ pageADepends, pageBDepends }) => {
    return arrayBuilderPages(validOptionsOptionalFlow, pageBuilder => ({
      summaryPage: pageBuilder.summaryPage(validSummaryPage),
      pageA: pageBuilder.itemPage({
        ...validPageA,
        depends: pageADepends,
      }),
      pageB: pageBuilder.itemPage({
        ...validPageB,
        depends: pageBDepends,
      }),
    }));
  };

  function testDepends({
    description,
    startPage,
    pageADepends,
    pageBDepends,
    startPageNav,
    navProps = {},
    expectFn,
    expectValue,
    arrayData = [],
    globalData = {},
  }) {
    it(description, () => {
      const goPath = sinon.spy();
      const goNextPath = sinon.spy();

      const pages = setupPages({
        pageADepends,
        pageBDepends,
      });

      const page = pages[startPage];
      page[startPageNav]({
        goPath,
        goNextPath,
        ...navProps,
        setFormData: sinon.spy(),
        formData: {
          ...globalData,
          hasEmployment: true,
          employers: arrayData,
        },
      });
      let fn = goPath;
      if (expectFn === 'goNextPath') {
        fn = goNextPath;
      }
      if (typeof expectValue === 'object') {
        expect(fn.args[0][0]).to.deep.eql(expectValue);
      } else {
        expect(fn.args[0][0]).to.eql(expectValue);
      }
    });
  }

  describe('summary navigations', () => {
    testDepends({
      description:
        'summary -> goForward -> pageA if global showA data pageA is true',
      startPage: 'summaryPage',
      startPageNav: 'onNavForward',
      pageADepends: formData => formData.showA,
      expectFn: 'goPath',
      expectValue: 'employers/pageA/0?add=true',
      arrayData: [],
      globalData: {
        showA: true,
      },
    });

    testDepends({
      description:
        'summary -> goForward -> pageB if global showA data pageA is false',
      startPage: 'summaryPage',
      startPageNav: 'onNavForward',
      pageADepends: formData => formData.showA,
      expectFn: 'goPath',
      expectValue: 'employers/pageB/0?add=true',
      arrayData: [],
      globalData: {
        showA: false,
      },
    });
  });

  describe('pageA navigations', () => {
    testDepends({
      description:
        'pageA -> goForward -> summary if showB is false on item 0 (add)',
      startPage: 'pageA',
      startPageNav: 'onNavForward',
      navProps: {
        index: 0,
        urlParams: { add: true },
      },
      pageBDepends: (formData, index) => formData?.employers?.[index].showB,
      expectFn: 'goPath',
      expectValue: 'employers-summary',
      arrayData: [
        {
          showB: false,
        },
        {
          showB: true,
        },
      ],
    });

    testDepends({
      description:
        'pageA -> goForward -> summary if showB is false on item 0 (edit)',
      startPage: 'pageA',
      startPageNav: 'onNavForward',
      navProps: {
        index: 0,
        urlParams: { edit: true },
      },
      pageBDepends: (formData, index) => formData?.employers?.[index].showB,
      expectFn: 'goPath',
      expectValue: 'employers-summary?updated=employers-0',
      arrayData: [
        {
          showB: false,
        },
        {
          showB: true,
        },
      ],
    });

    testDepends({
      description:
        'pageA -> goForward -> review if showB is false on item 0 (add/review)',
      startPage: 'pageA',
      startPageNav: 'onNavForward',
      navProps: {
        index: 0,
        urlParams: { add: true, review: true },
      },
      pageBDepends: (formData, index) => formData?.employers?.[index].showB,
      expectFn: 'goPath',
      expectValue: 'review-and-submit?updated=employers-0',
      arrayData: [
        {
          showB: false,
        },
        {
          showB: true,
        },
      ],
    });

    testDepends({
      description:
        'pageA -> goForward -> review if showB is false on item 0 (edit/review)',
      startPage: 'pageA',
      startPageNav: 'onNavForward',
      navProps: {
        index: 0,
        urlParams: { edit: true, review: true },
      },
      pageBDepends: (formData, index) => formData?.employers?.[index].showB,
      expectFn: 'goPath',
      expectValue: 'review-and-submit?updated=employers-0',
      arrayData: [
        {
          showB: false,
        },
        {
          showB: true,
        },
      ],
    });

    testDepends({
      description:
        'pageA -> goForward -> pageB if showB is true on item 1 (add)',
      startPage: 'pageA',
      startPageNav: 'onNavForward',
      pageBDepends: (formData, index) => formData?.employers?.[index].showB,
      navProps: {
        index: 1,
        urlParams: { add: true },
      },
      expectFn: 'goNextPath',
      expectValue: { add: true },
      arrayData: [
        {
          showB: false,
        },
        {
          showB: true,
        },
      ],
    });

    testDepends({
      description:
        'pageA -> goForward -> pageB if showB is true on item 1 (edit)',
      startPage: 'pageA',
      startPageNav: 'onNavForward',
      pageBDepends: (formData, index) => formData?.employers?.[index].showB,
      navProps: {
        index: 1,
        urlParams: { edit: true },
      },
      expectFn: 'goNextPath',
      expectValue: { edit: true },
      arrayData: [
        {
          showB: false,
        },
        {
          showB: true,
        },
      ],
    });

    testDepends({
      description:
        'pageA -> goForward -> pageB if showB is true on item (review/edit)',
      startPage: 'pageA',
      startPageNav: 'onNavForward',
      pageBDepends: (formData, index) => formData?.employers?.[index].showB,
      navProps: {
        index: 1,
        urlParams: { edit: true, review: true },
      },
      expectFn: 'goNextPath',
      expectValue: { edit: true, review: true },
      arrayData: [
        {
          name: 'employer1',
          showB: false,
        },
        {
          name: 'employer2',
          showB: true,
        },
      ],
    });
  });

  describe('pageB navigations', () => {
    testDepends({
      description:
        'pageB -> goBack -> summary if showA is false on global form data',
      startPage: 'pageB',
      startPageNav: 'onNavBack',
      navProps: {
        index: 0,
        urlParams: { add: true },
      },
      pageADepends: formData => formData.showA,
      expectFn: 'goPath',
      expectValue: 'employers-summary',
      globalData: {
        showA: false,
      },
    });

    testDepends({
      description: 'pageB -> goBack -> summary if showA is false on item (add)',
      startPage: 'pageB',
      startPageNav: 'onNavBack',
      navProps: {
        index: 0,
        urlParams: { add: true },
      },
      pageADepends: (formData, index) => formData?.employers?.[index].showA,
      expectFn: 'goPath',
      expectValue: 'employers-summary',
      arrayData: [
        {
          showA: false,
        },
      ],
    });

    testDepends({
      description:
        'pageB -> goBack -> summary if showA is false on item (edit)',
      startPage: 'pageB',
      startPageNav: 'onNavBack',
      navProps: {
        urlParams: { edit: true },
      },
      pageADepends: (formData, index) => formData?.employers?.[index].showA,
      expectFn: 'goPath',
      expectValue: 'employers-summary',
      arrayData: [
        {
          showA: false,
        },
      ],
    });
  });
});
