import { expect } from 'chai';
import sinon from 'sinon';
import { normalizedForm } from 'applications/simple-forms-form-engine/shared/config/formConfig';
import { listLoopPages } from 'applications/simple-forms-form-engine/shared/config/pages/listLoop';

const findChapterByType = type =>
  normalizedForm.chapters.find(chapter => chapter.type === type);

describe('listLoopPages', () => {
  const optional = {
    id: 162032,
    type: 'digital_form_list_loop',
    optional: true,
    chapterTitle: "Veteran's employment history",
    pageTitle: 'List & Loop',
  };
  const pageBuilder = {
    introPage: pageConfig => pageConfig,
    itemPage: pageConfig => pageConfig,
    summaryPage: pageConfig => pageConfig,
  };
  const required = findChapterByType('digital_form_list_loop');

  let arrayBuilderStub;

  beforeEach(() => {
    arrayBuilderStub = sinon
      .stub()
      .callsFake((options, pageBuilderCallback) =>
        pageBuilderCallback(pageBuilder),
      );
  });

  it('includes the right options', () => {
    listLoopPages(required, arrayBuilderStub);

    const options = arrayBuilderStub.getCall(0).args[0];

    expect(options.arrayPath).to.eq(required.nounPlural);
    expect(options.nounSingular).to.eq('employer');
    expect(options.nounPlural).to.eq('employers');
    expect(options.maxItems).to.eq(4);
  });

  it('includes a summary page', () => {
    const { employerSummary } = listLoopPages(optional, arrayBuilderStub);

    expect(employerSummary.path).to.eq('employers');
  });

  context('when the variation is employment history', () => {
    const employmentHistory = findChapterByType('list_loop_employment_history');

    it('includes the correct option values', () => {
      listLoopPages(employmentHistory, arrayBuilderStub);
      const options = arrayBuilderStub.getCall(0).args[0];

      expect(options.arrayPath).to.eq('employers');
    });

    it('includes a name page', () => {
      const { employerNamePage } = listLoopPages(
        employmentHistory,
        arrayBuilderStub,
      );

      expect(employerNamePage.title).to.eq(
        'Name and address of employer or unit',
      );
    });

    it('includes a date page', () => {
      const { employerDatePage } = listLoopPages(
        employmentHistory,
        arrayBuilderStub,
      );

      expect(employerDatePage.title).to.eq('Dates you were employed');
    });

    it('includes a details page', () => {
      const { employerDetailPage } = listLoopPages(
        employmentHistory,
        arrayBuilderStub,
      );

      expect(employerDetailPage.title).to.eq('Employment detail for employer');
    });
  });

  describe('additionalFields', () => {
    let pages;

    context('when optional is false', () => {
      beforeEach(() => {
        pages = listLoopPages(required, arrayBuilderStub);
      });

      it('sets required to true', () => {
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.required).to.eq(true);
      });

      it('includes an introPage', () => {
        const { employer: introPage, employerSummary } = pages;

        expect(introPage.title).to.eq('Employers');

        expect(employerSummary.title).to.eq('Review your employers');
        expect(employerSummary.path).to.eq('employers-summary');
      });
    });

    context('when optional is true', () => {
      beforeEach(() => {
        pages = listLoopPages(optional, arrayBuilderStub);
      });

      it('sets required to false', () => {
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.required).to.eq(false);
      });

      it('does not include an introPage', () => {
        const { employerSummary } = pages;

        expect(pages.employer).to.eq(undefined);
        expect(employerSummary.title).to.eq('Your employers');
        expect(employerSummary.path).to.eq('employers');
      });
    });
  });

  describe('isItemIncomplete', () => {
    context('when a required attribute is missing', () => {
      const item = {
        name: 'Test name',
        address: '1234 Main St',
      };

      it('returns true', () => {
        listLoopPages(optional, arrayBuilderStub);
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.isItemIncomplete(item)).to.eq(true);
      });
    });

    context('when all required items are present', () => {
      const item = {
        name: 'Test name',
        address: '1234 Main St',
        dateRange: '2020-01-02 to 2024-03-04',
      };

      it('returns false', () => {
        listLoopPages(optional, arrayBuilderStub);
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.isItemIncomplete(item)).to.eq(false);
      });
    });
  });
});
