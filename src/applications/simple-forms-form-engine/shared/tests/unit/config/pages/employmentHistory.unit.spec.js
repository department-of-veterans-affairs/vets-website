import { expect } from 'chai';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import {
  datePage,
  detailPage,
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
