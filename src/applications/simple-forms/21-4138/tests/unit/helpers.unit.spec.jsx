import { expect } from 'chai';
import { startOfDay, subYears } from 'date-fns';
import {
  getMockData,
  getFullNameLabels,
  isEligibleForDecisionReview,
  isEligibleToSubmitStatement,
} from '../../helpers';
import { STATEMENT_TYPES } from '../../config/constants';

describe('getMockData', () => {
  let mockData = { data: 'mockData' };
  let isLocalHost = () => true;

  it('returns mock data when on localhost and not running in Cypress', () => {
    window.Cypress = false;
    expect(getMockData(mockData, isLocalHost)).to.deep.equal(mockData);
  });

  it('returns undefined when mockData is falsy', () => {
    mockData = undefined;
    expect(getMockData(mockData, isLocalHost)).to.be.undefined;
  });

  it('returns undefined when not on localhost', () => {
    isLocalHost = () => false;
    expect(getMockData(mockData, isLocalHost)).to.be.undefined;
  });

  it('returns undefined when running in Cypress', () => {
    window.Cypress = true;
    expect(getMockData(mockData, isLocalHost)).to.be.undefined;
  });
});

describe('getFullNameLabels', () => {
  let label = 'middle name';
  let skipMiddleCheck = false;

  it('returns "Middle initial" when label is "middle name" and skipMiddleCheck is false', () => {
    expect(getFullNameLabels(label, skipMiddleCheck)).to.equal(
      'Middle initial',
    );
  });

  it('returns capitalized label when label is "middle name" but skipMiddleCheck is true', () => {
    skipMiddleCheck = true;
    expect(getFullNameLabels(label, skipMiddleCheck)).to.equal('Middle name');
  });

  it('capitalizes the first letter of a generic label', () => {
    label = 'first name';
    expect(getFullNameLabels(label, skipMiddleCheck)).to.equal('First name');
  });

  it('handles empty string input gracefully', () => {
    label = '';
    expect(getFullNameLabels(label, skipMiddleCheck)).to.equal('');
  });

  it('handles single character input', () => {
    label = 'a';
    expect(getFullNameLabels(label, skipMiddleCheck)).to.equal('A');
  });
});

describe('isEligibleForDecisionReview', () => {
  let decisionDate;

  it('returns false when decisionDate is missing', () => {
    expect(isEligibleForDecisionReview(decisionDate)).to.equal(false);
  });

  it('returns true when decisionDate is within one year', () => {
    const sixMonthsAgo = startOfDay(subYears(new Date(), 0.5));
    [decisionDate] = sixMonthsAgo.toISOString().split('T');
    expect(isEligibleForDecisionReview(decisionDate)).to.equal(true);
  });

  it('returns false when decisionDate is more than one year ago', () => {
    const twoYearsAgo = startOfDay(subYears(new Date(), 2));
    [decisionDate] = twoYearsAgo.toISOString().split('T');
    expect(isEligibleForDecisionReview(decisionDate)).to.equal(false);
  });

  it('handles invalid date formats gracefully', () => {
    decisionDate = 'invalid-date';
    expect(isEligibleForDecisionReview(decisionDate)).to.equal(false);
  });
});

describe('isEligibleToSubmitStatement', () => {
  let formData = { statementType: STATEMENT_TYPES.NOT_LISTED };

  it('returns true when statementType is specified and is NOT_LISTED', () => {
    expect(isEligibleToSubmitStatement(formData)).to.equal(true);
  });

  it('returns true when statementType is specified and is PRIORITY_PROCESSING', () => {
    formData = { statementType: STATEMENT_TYPES.PRIORITY_PROCESSING };
    expect(isEligibleToSubmitStatement(formData)).to.equal(true);
  });

  it('is ineligible when statementType is specified and not in the allowed list', () => {
    formData = { statementType: 'OTHER_TYPE' };
    expect(isEligibleToSubmitStatement(formData)).to.equal(false);
  });

  it('is not ineligible if statementType is not specified - user may have been redirected', () => {
    formData = {};
    expect(isEligibleToSubmitStatement(formData)).to.equal(true);
  });

  it('is not ineligible if formData is null - user may have been redirected', () => {
    formData = null;
    expect(isEligibleToSubmitStatement(formData)).to.equal(true);
  });
  it('is not ineligible if formData is undefined - user may have been redirected', () => {
    formData = undefined;
    expect(isEligibleToSubmitStatement(formData)).to.equal(true);
  });
});
