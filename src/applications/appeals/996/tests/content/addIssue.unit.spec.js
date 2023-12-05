import { expect } from 'chai';

import { issueErrorMessages } from '../../content/addIssue';

describe('addIssue issueErrorMessages invalidDateRange', () => {
  const { invalidDateRange } = issueErrorMessages;
  it('should return a string with the date range', () => {
    // This function should always be called with values; but shouldn't fail if
    // the values are missing
    expect(invalidDateRange()).to.eq(
      'Please enter a year between undefined and undefined',
    );
    expect(invalidDateRange(2000, 2001)).to.eq(
      'Please enter a year between 2000 and 2001',
    );
    expect(invalidDateRange(1900, 2100)).to.eq(
      'Please enter a year between 1900 and 2100',
    );
  });
});
