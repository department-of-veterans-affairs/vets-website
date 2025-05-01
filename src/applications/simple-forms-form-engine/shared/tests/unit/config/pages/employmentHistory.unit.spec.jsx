import { expect } from 'chai';
import sinon from 'sinon';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import * as arrayBuilderPatterns from 'platform/forms-system/src/js/web-component-patterns/arrayBuilderPatterns';
import {
  datePage,
  detailPage,
  namePage,
  summaryPage,
} from 'applications/simple-forms-form-engine/shared/config/pages/employmentHistory';

describe('datePage', () => {
  it('includes the proper attributes', () => {
    expect(datePage.title).to.eq('Dates you were employed');
    expect(datePage.path).to.eq('employers/:index/dates');
    expect(datePage.schema.properties.dateRange).to.eq(
      webComponentPatterns.currentOrPastDateRangeSchema,
    );
    expect(datePage.uiSchema.dateRange).to.not.eq(undefined);
  });
});

describe('detailPage', () => {
  it('includes the proper attributes', () => {
    expect(detailPage.title).to.eq('Employment detail for employer');
    expect(detailPage.path).to.eq('employers/:index/detail');
    expect(detailPage.schema.properties.typeOfWork).to.eq(
      webComponentPatterns.textSchema,
    );
    expect(detailPage.schema.properties.hoursPerWeek).to.eq(
      webComponentPatterns.numberSchema,
    );
    expect(detailPage.schema.properties.lostTime).to.eq(
      webComponentPatterns.numberSchema,
    );
    expect(detailPage.schema.properties.highestIncome).to.eq(
      webComponentPatterns.textSchema,
    );
    expect(detailPage.uiSchema.typeOfWork).to.not.eq(undefined);
    expect(detailPage.uiSchema.hoursPerWeek).to.not.eq(undefined);
    expect(detailPage.uiSchema.lostTime).to.not.eq(undefined);
    expect(detailPage.uiSchema.highestIncome).to.not.eq(undefined);
  });
});

describe('namePage', () => {
  const options = {
    nounSingular: 'test employer',
  };

  let spy;

  beforeEach(() => {
    spy = sinon.spy(arrayBuilderPatterns, 'arrayBuilderItemFirstPageTitleUI');
  });

  afterEach(() => {
    spy.restore();
  });

  it('includes the proper attributes', () => {
    const employerNamePage = namePage(options);

    expect(employerNamePage.title).to.eq(
      'Name and address of employer or unit',
    );
    expect(employerNamePage.path).to.eq('employers/:index/name-and-address');
    expect(employerNamePage.schema.properties.address).to.not.eq(undefined);
    expect(employerNamePage.schema.properties.name).to.eq(
      webComponentPatterns.textSchema,
    );
    expect(employerNamePage.uiSchema.address).to.not.eq(undefined);
    expect(employerNamePage.uiSchema.name).to.not.eq(undefined);
  });

  it('calls arrayBuilderItemFirstPageTitleUI with the correct option', () => {
    namePage(options);

    expect(
      spy.calledWithMatch({
        title: 'Name and address of employer or unit',
        nounSingular: options.nounSingular,
      }),
    ).to.eq(true);
  });
});

describe('summaryPage', () => {
  let yesNoSpy;

  beforeEach(() => {
    yesNoSpy = sinon.spy(arrayBuilderPatterns, 'arrayBuilderYesNoUI');
  });

  afterEach(() => {
    yesNoSpy.restore();
  });

  it('includes the proper attributes', () => {
    const options = {
      required: false,
    };
    const employerSummary = summaryPage(options);
    const [, yesNoOptions, yesNoOptionsMore] = yesNoSpy.getCall(0).args;

    expect(employerSummary.title).to.eq('Your employers');
    expect(employerSummary.path).to.eq('employers');
    expect(employerSummary.schema.properties['view:hasEmployers']).to.eq(
      webComponentPatterns.arrayBuilderYesNoSchema,
    );
    expect(yesNoOptions.title).to.eq(
      'Were you employed by the VA, others or self-employed at any time during the last 12 months?',
    );
    expect(yesNoOptionsMore.title).to.eq(
      'Do you have another employer to report?',
    );
  });
});
