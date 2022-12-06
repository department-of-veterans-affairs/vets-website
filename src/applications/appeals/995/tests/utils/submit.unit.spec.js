import { expect } from 'chai';
import { PRIMARY_PHONE, SELECTED, EVIDENCE_VA } from '../../constants';
import { getDate } from '../../utils/dates';

import {
  removeEmptyEntries,
  getTimeZone,
  createIssueName,
  getContestedIssues,
  // addIncludedIssues,
  getAddress,
  getPhone,
  getEvidence,
} from '../../utils/submit';

const validDate1 = getDate({ offset: { months: -2 } });
const issue1 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'tinnitus',
      description: 'both ears',
      approxDecisionDate: validDate1,
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
      decisionDate: validDate1,
      decisionIssueId: 1,
      ratingIssueReferenceId: '2',
      ratingDecisionReferenceId: '3',
    },
  },
};

const validDate2 = getDate({ offset: { months: -4 } });
const issue2 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'left knee',
      approxDecisionDate: validDate2,
      decisionIssueId: 4,
      ratingIssueReferenceId: '5',
    },
  },
  result: {
    type: 'contestableIssue',
    attributes: {
      issue: 'left knee - 0%',
      decisionDate: validDate2,
      decisionIssueId: 4,
      ratingIssueReferenceId: '5',
    },
  },
};

describe('createIssueName', () => {
  const getName = (name, description, percent) =>
    createIssueName({
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

describe('getContestedIssues', () => {
  it('should return all issues', () => {
    const formData = {
      contestedIssues: [
        { ...issue1.raw, [SELECTED]: true },
        { ...issue2.raw, [SELECTED]: true },
      ],
    };
    expect(getContestedIssues(formData)).to.deep.equal([
      issue1.result,
      issue2.result,
    ]);
  });
  it('should return second issue', () => {
    const formData = {
      contestedIssues: [
        { ...issue1.raw, [SELECTED]: false },
        { ...issue2.raw, [SELECTED]: true },
      ],
    };
    expect(getContestedIssues(formData)).to.deep.equal([issue2.result]);
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
    const wrap = obj => ({
      veteran: { address: obj },
    });
    expect(getAddress({})).to.deep.equal({});
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
          countryCodeIso2: 'US',
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
      zipCode5: '00000',
      countryCodeISO2: 'US',
      internationalPostalCode: '12345',
    });
    expect(
      getAddress(wrap({ internationalPostalCode: '55555' })),
    ).to.deep.equal({
      zipCode5: '00000',
      internationalPostalCode: '55555',
    });
  });
});

describe('getPhone', () => {
  const phone1 = {
    countryCode: '1',
    areaCode: '222',
    phoneNumber: '1234567',
    phoneNumberExt: '0000',
  };
  const phone2 = {
    countryCode: '1',
    areaCode: '333',
    phoneNumber: '3456789',
    phoneNumberExt: '0001',
  };
  it('should return a cleaned up phone object from the default home phone', () => {
    const wrap = obj => ({ veteran: { homePhone: obj } });
    expect(getPhone()).to.deep.equal({});
    expect(getPhone(wrap({}))).to.deep.equal({});
    expect(getPhone(wrap({ temp: 'test' }))).to.deep.equal({});
    expect(getPhone(wrap({ areaCode: '111' }))).to.deep.equal({
      areaCode: '111',
    });
    expect(
      getPhone(
        wrap({
          ...phone1,
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal(phone1);
  });
  it('should ignore selected primary phone when only home is available', () => {
    const wrap = primary => ({
      [PRIMARY_PHONE]: primary,
      veteran: { homePhone: phone1, mobilePhone: {} },
    });
    expect(getPhone(wrap('home'))).to.deep.equal(phone1);
    expect(getPhone(wrap('mobile'))).to.deep.equal(phone1);
  });
  it('should ignore selected primary phone when only mobile is available', () => {
    const wrap = primary => ({
      [PRIMARY_PHONE]: primary,
      veteran: { homePhone: {}, mobilePhone: phone2 },
    });
    expect(getPhone(wrap('home'))).to.deep.equal(phone2);
    expect(getPhone(wrap('mobile'))).to.deep.equal(phone2);
  });
  it('should return selected primary phone', () => {
    const wrap = primary => ({
      [PRIMARY_PHONE]: primary,
      veteran: { homePhone: phone1, mobilePhone: phone2 },
    });
    expect(getPhone(wrap('home'))).to.deep.equal(phone1);
    expect(getPhone(wrap('mobile'))).to.deep.equal(phone2);
  });
});

describe('getTimeZone', () => {
  it('should return a string', () => {
    // result will be a location string, not stubbing for this test
    expect(getTimeZone().length).to.be.greaterThan(1);
  });
});

describe('getEvidence', () => {
  const getData = ({ hasVa = true } = {}) => ({
    data: {
      [EVIDENCE_VA]: hasVa,
      locations: [
        {
          locationAndName: 'test 1',
          issues: ['1', '2'],
          evidenceDates: { from: '2022-01-01', to: '2022-02-02' },
        },
        {
          locationAndName: 'test 2',
          issues: ['1', '2'],
          evidenceDates: { from: '2022-03-03', to: '2022-04-04' },
        },
      ],
    },
    result: {
      evidenceType: ['retrieval'],
      retrieveFrom: [
        {
          type: 'retrievalEvidence',
          attributes: {
            locationAndName: 'test 1',
            evidenceDates: [{ from: '2022-01-01', to: '2022-02-02' }],
          },
        },
        {
          type: 'retrievalEvidence',
          attributes: {
            locationAndName: 'test 2',
            evidenceDates: [{ from: '2022-03-03', to: '2022-04-04' }],
          },
        },
      ],
    },
  });

  it('should skip adding evidence when not selected', () => {
    const evidence = getData({ hasVa: false });
    expect(getEvidence(evidence.data)).to.deep.equal({ evidenceType: [] });
  });
  it('should process evidence when available', () => {
    const evidence = getData();
    expect(getEvidence(evidence.data)).to.deep.equal(evidence.result);
  });
});
