import { expect } from 'chai';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import { datePage } from 'applications/simple-forms-form-engine/shared/config/pages/employmentHistory';

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
