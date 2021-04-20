import { expect } from 'chai';
import { add, format } from 'date-fns';

import {
  getEligibleContestableIssues,
  getIssueName,
  getContestableIssues,
  addIncludedIssues,
  removeEmptyEntries,
  getAddress,
  getPhone,
} from '../../utils/helpers';

const issue1 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'tinnitus',
      description: 'both ears',
      approxDecisionDate: '1900-01-01',
      decisionIssueId: 1,
      ratingIssueReferenceId: '2',
      ratingDecisionReferenceId: '3',
      ratingIssuePercentNumber: '10',
    },
  },
  result: {
    type: 'contestableIssue',
    attributes: {
      issue: 'tinnitus - 10% - both ears',
      decisionDate: '1900-01-01',
      decisionIssueId: 1,
      ratingIssueReferenceId: '2',
      ratingDecisionReferenceId: '3',
    },
  },
};

const issue2 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'left knee',
      approxDecisionDate: '1900-01-02',
      decisionIssueId: 4,
      ratingIssueReferenceId: '5',
    },
  },
  result: {
    type: 'contestableIssue',
    attributes: {
      issue: 'left knee - 0%',
      decisionDate: '1900-01-02',
      decisionIssueId: 4,
      ratingIssueReferenceId: '5',
    },
  },
};

describe('getEligibleContestableIssues', () => {
  it('should remove ineligible dates', () => {
    expect(
      getEligibleContestableIssues([issue1.raw, issue2.raw]),
    ).to.deep.equal([]);
  });
  it('should keep eligible dates', () => {
    const issue = {
      type: 'contestableIssue',
      attributes: {
        ...issue1.raw,
        approxDecisionDate: format(
          add(new Date(), { months: -2 }),
          'yyyy-MM-dd',
        ),
      },
    };
    expect(getEligibleContestableIssues([issue, issue2.raw])).to.deep.equal([
      issue,
    ]);
  });
});

describe('getIssueName', () => {
  const getName = (name, description, percent) =>
    getIssueName({
      attributes: {
        ratingIssueSubjectText: name,
        ratingIssuePercentNumber: percent,
        description,
      },
    });

  it('should combine issue details into the name', () => {
    // contestable issues only
    expect(getName('test', 'foo', '10')).to.eq('test - 10% - foo');
    expect(getName('test', 'xyz', null)).to.eq('test - 0% - xyz');
    expect(getName('test')).to.eq('test - 0%');
  });
});

describe('getContestableIssues', () => {
  it('should return all issues', () => {
    const formData = {
      contestableIssues: [
        { ...issue1.raw, 'view:selected': true },
        { ...issue2.raw, 'view:selected': true },
      ],
    };
    expect(getContestableIssues(formData)).to.deep.equal([
      issue1.result,
      issue2.result,
    ]);
  });
  it('should return second issue', () => {
    const formData = {
      contestableIssues: [
        { ...issue1.raw, 'view:selected': false },
        { ...issue2.raw, 'view:selected': true },
      ],
    };
    expect(getContestableIssues(formData)).to.deep.equal([issue2.result]);
  });
});

describe('addIncludedIssues', () => {
  it('should add additional items to contestableIssues array', () => {
    const issue = {
      type: 'contestableIssue',
      attributes: { issue: 'test', decisionDate: '2000-01-01' },
    };
    const formData = {
      contestableIssues: [
        { ...issue1.raw, 'view:selected': false },
        { ...issue2.raw, 'view:selected': true },
      ],
      additionalIssues: [issue.attributes],
    };
    expect(addIncludedIssues(formData)).to.deep.equal([issue2.result, issue]);
    expect(
      addIncludedIssues({ ...formData, additionalIssues: [] }),
    ).to.deep.equal([issue2.result]);
  });
});

describe('removeEmptyEntries', () => {
  it('should remove empty string items', () => {
    expect(removeEmptyEntries({ a: '', b: 1, c: 'x', d: '' })).to.deep.equal({
      b: 1,
      c: 'x',
    });
  });
  it('should not remove null or undefined items', () => {
    expect(removeEmptyEntries({ a: null, b: undefined, c: 3 })).to.deep.equal({
      a: null,
      b: undefined,
      c: 3,
    });
  });
});

describe('getAddress', () => {
  it('should return a cleaned up address object', () => {
    const wrap = obj => ({ veteran: { address: obj } });
    expect(getAddress()).to.deep.equal({});
    expect(getAddress(wrap({}))).to.deep.equal({});
    expect(getAddress(wrap({ temp: 'test' }))).to.deep.equal({});
    expect(getAddress(wrap({ addressLine1: 'test' }))).to.deep.equal({
      addressLine1: 'test',
    });
    expect(getAddress(wrap({ zipCode: '10101' }))).to.deep.equal({
      zipCode5: '10101',
    });
    expect(
      getAddress(
        wrap({
          addressLine1: '123 test',
          addressLine2: 'c/o foo',
          addressLine3: 'suite 99',
          city: 'Big City',
          stateCode: 'NV',
          zipCode: '10101',
          countryName: 'USA',
          internationalPostalCode: '12345',
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal({
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode5: '10101',
      countryName: 'USA',
      internationalPostalCode: '12345',
    });
  });
});

describe('getPhone', () => {
  it('should return a cleaned up phone object', () => {
    const wrap = obj => ({ veteran: { phone: obj } });
    expect(getPhone()).to.deep.equal({});
    expect(getPhone(wrap({}))).to.deep.equal({});
    expect(getPhone(wrap({ temp: 'test' }))).to.deep.equal({});
    expect(getPhone(wrap({ areaCode: '111' }))).to.deep.equal({
      areaCode: '111',
    });
    expect(
      getPhone(
        wrap({
          countryCode: '1',
          areaCode: '222',
          phoneNumber: '1234567',
          phoneNumberExt: '0000',
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal({
      countryCode: '1',
      areaCode: '222',
      phoneNumber: '1234567',
      phoneNumberExt: '0000',
    });
  });
});
