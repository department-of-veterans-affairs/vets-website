import { expect } from 'chai';
import sinon from 'sinon';
import { normalizedForm } from 'applications/simple-forms-form-engine/shared/config/formConfig';
import { listLoopPages } from 'applications/simple-forms-form-engine/shared/config/pages/listLoop';
import { render } from '@testing-library/react';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import * as titlePattern from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import * as arrayBuilderPatterns from 'platform/forms-system/src/js/web-component-patterns/arrayBuilderPatterns';
import { kebabCase } from 'lodash';
import { componentKey } from 'applications/simple-forms-form-engine/shared/config/pages/customStepPage';

const findChapterByType = type =>
  normalizedForm.chapters.find(chapter => chapter.type === type);

describe('listLoopPages', () => {
  const optional = {
    id: 162032,
    nounSingular: 'optional thing',
    nounPlural: 'optional things',
    type: 'digital_form_list_loop',
    optional: true,
    chapterTitle: "Veteran's employment history",
    pageTitle: 'List & Loop',
    pages: [],
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
    expect(options.nounSingular).to.eq(required.nounSingular);
    expect(options.nounPlural).to.eq(required.nounPlural);
    expect(options.maxItems).to.eq(required.maxItems);
  });

  context('when the variation is employment history', () => {
    const employmentHistory = findChapterByType('list_loop_employment_history');

    it('includes the correct option values', () => {
      listLoopPages(employmentHistory, arrayBuilderStub);
      const options = arrayBuilderStub.getCall(0).args[0];

      expect(options.arrayPath).to.eq('employers');
      expect(options.maxItems).to.eq(4);
      expect(options.nounSingular).to.eq('employer');
      expect(options.nounPlural).to.eq('employers');
      expect(options.required).to.eq(false);
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

    describe('isItemIncomplete', () => {
      context('when a required attribute is missing', () => {
        const item = {
          name: 'Test name',
          address: '1234 Main St',
        };

        it('returns true', () => {
          listLoopPages(employmentHistory, arrayBuilderStub);
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
          listLoopPages(employmentHistory, arrayBuilderStub);
          const options = arrayBuilderStub.getCall(0).args[0];

          expect(options.isItemIncomplete(item)).to.eq(false);
        });
      });
    });

    describe('cardDescription', () => {
      const item = {
        dateRange: {
          from: '2020-04-21',
          to: '2021-05-23',
        },
      };

      it('includes all appropriate fields', () => {
        listLoopPages(employmentHistory, arrayBuilderStub);
        const options = arrayBuilderStub.getCall(0).args[0];
        const { container } = render(options.text.cardDescription(item));

        expect(container).to.have.text('04/21/2020 - 05/23/2021');
      });
    });
  });

  describe('optional and required', () => {
    let pages;
    let yesNoSpy;

    beforeEach(() => {
      yesNoSpy = sinon.spy(arrayBuilderPatterns, 'arrayBuilderYesNoUI');
    });

    afterEach(() => {
      yesNoSpy.restore();
    });

    context('when optional is false', () => {
      let titleSpy;

      beforeEach(() => {
        titleSpy = sinon.spy(titlePattern, 'titleUI');
        pages = listLoopPages(required, arrayBuilderStub);
      });

      afterEach(() => {
        titleSpy.restore();
      });

      it('sets required to true', () => {
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.required).to.eq(true);
      });

      it('includes an introPage', () => {
        const { filmSummary } = pages;
        const introPage = pages[required.nounSingular];
        const [, yesNoOptions, yesNoOptionsMore] = yesNoSpy.getCall(0).args;

        expect(introPage.title).to.eq(required.chapterTitle);
        expect(introPage.path).to.eq(required.nounPlural);
        // introPages have no schemas
        expect(Object.keys(introPage.schema.properties).length).to.eq(0);
        expect(
          titleSpy.calledWith(required.chapterTitle, required.sectionIntro),
        ).to.eq(true);

        expect(filmSummary.title).to.eq('Review your films');
        expect(filmSummary.path).to.eq('films-summary');
        expect(filmSummary.schema.properties['view:hasFilms']).to.eq(
          webComponentPatterns.arrayBuilderYesNoSchema,
        );
        expect(yesNoOptions.title).to.eq(undefined);
        expect(yesNoOptionsMore.title).to.eq(undefined);
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
        const { optionalThingSummary } = pages;
        const [, yesNoOptions, yesNoOptionsMore] = yesNoSpy.getCall(0).args;

        expect(pages.employer).to.eq(undefined);
        expect(optionalThingSummary.title).to.eq(optional.chapterTitle);
        expect(optionalThingSummary.path).to.eq('optional-things');
        expect(
          optionalThingSummary.schema.properties['view:hasOptionalThings'],
        ).to.eq(webComponentPatterns.arrayBuilderYesNoSchema);
        expect(yesNoOptions.title).to.eq(undefined);
        expect(yesNoOptionsMore.title).to.eq(undefined);
      });
    });
  });

  describe('isItemIncomplete', () => {
    context('when a required attribute is missing', () => {
      const item = {
        name: 'Test Film',
        component176030: '1970-06-23',
        component176032: 'Test Character',
      };

      it('returns true', () => {
        listLoopPages(required, arrayBuilderStub);
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.isItemIncomplete(item)).to.eq(true);
      });
    });

    context('when all required items are present', () => {
      const item = {
        name: 'Test Film',
        component176030: '1970-06-23',
        component176032: 'Test Character',
        component176034: 'An example of a longer response. Sorta.',
      };

      it('returns false', () => {
        listLoopPages(required, arrayBuilderStub);
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.isItemIncomplete(item)).to.eq(false);
      });
    });
  });

  describe('cardDescription', () => {
    const item = {
      component176030: '1970-06-23',
      component176032: 'Test Character',
    };

    it('includes all appropriate fields', () => {
      listLoopPages(required, arrayBuilderStub);
      const options = arrayBuilderStub.getCall(0).args[0];
      const { container } = render(options.text.cardDescription(item));

      expect(container.querySelector('li')).to.exist;

      expect(container).to.include.text('06/23/1970');
      expect(container).to.include.text(item.component176032);
    });
  });

  describe('item pages', () => {
    describe('name page', () => {
      let spy;

      beforeEach(() => {
        spy = sinon.spy(
          arrayBuilderPatterns,
          'arrayBuilderItemFirstPageTitleUI',
        );
      });

      afterEach(() => {
        spy.restore();
      });

      it('includes the proper attributes', () => {
        const pages = listLoopPages(required, arrayBuilderStub);
        const namePage = pages.filmNamePage;

        expect(namePage.title).to.eq(required.itemNameLabel);
        expect(namePage.path).to.eq('films/:index/name');
        expect(namePage.schema.properties.name).to.eq(
          webComponentPatterns.textSchema,
        );
        expect(namePage.uiSchema.name).to.not.eq(undefined);
      });

      it('calls arrayBuilderItemFirstPageTitleUI with the correct option', () => {
        listLoopPages(required, arrayBuilderStub);

        expect(
          spy.calledWithMatch({
            title: required.itemNameLabel,
            nounSingular: required.nounSingular,
          }),
        ).to.eq(true);
      });
    });

    required.pages.forEach(page => {
      describe(page.pageTitle, () => {
        const testName = 'Oscar Winning Film';

        let pages;
        let subsequentTitleStub;

        beforeEach(() => {
          subsequentTitleStub = sinon
            .stub(arrayBuilderPatterns, 'arrayBuilderItemSubsequentPageTitleUI')
            .callsFake((title, description) => ({
              withName: title({ formData: { name: testName } }),
              withoutName: title({ formData: {} }),
              description,
            }));

          pages = listLoopPages(required, arrayBuilderStub);
        });

        afterEach(() => {
          subsequentTitleStub.restore();
        });

        it('includes the correct attributes', () => {
          const itemPage = pages[`film${page.id}`];

          expect(itemPage.title).to.eq(page.pageTitle);
          expect(itemPage.path).to.eq(
            `films/:index/${kebabCase(page.pageTitle)}`,
          );
        });

        it('calls titleUI with the correct args', () => {
          const itemPage = pages[`film${page.id}`];

          expect(itemPage.uiSchema.withName).to.eq(
            `${page.pageTitle} for ${testName}`,
          );
          expect(itemPage.uiSchema.withoutName).to.eq(page.pageTitle);
          expect(itemPage.uiSchema.description).to.eq(page.bodyText);
        });

        it('includes all components', () => {
          const componentKeys = page.components.map(component =>
            componentKey(component),
          );
          const itemPage = pages[`film${page.id}`];

          expect(Object.keys(itemPage.schema.properties)).to.include.members(
            componentKeys,
          );
          expect(Object.keys(itemPage.uiSchema)).to.include.members(
            componentKeys,
          );
        });
      });
    });
  });
});
