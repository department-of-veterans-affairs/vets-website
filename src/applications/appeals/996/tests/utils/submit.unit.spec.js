import { expect } from 'chai';

import {
  getAddress,
  getConferenceTime,
  getRep,
  getTimeZone,
  getContact,
} from '../../utils/submit';

import { SELECTED } from '../../../shared/constants';
import { getDate } from '../../../shared/utils/dates';
import {
  addIncludedIssues,
  createIssueName,
  getContestedIssues,
  getPhone,
  removeEmptyEntries,
} from '../../../shared/utils/submit';

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
  it('should return empty array', () => {
    expect(getContestedIssues()).to.deep.equal([]);
  });
});

describe('addIncludedIssues', () => {
  it('should add additional items to contestedIssues array', () => {
    const issue = {
      type: 'contestableIssue',
      attributes: { issue: 'test', decisionDate: validDate1 },
    };
    const formData = {
      contestedIssues: [
        { ...issue1.raw, [SELECTED]: false },
        { ...issue2.raw, [SELECTED]: true },
      ],
      additionalIssues: [
        { issue: 'not-added', decisionDate: validDate2, [SELECTED]: false },
        { ...issue.attributes, [SELECTED]: true },
      ],
    };
    expect(addIncludedIssues(formData)).to.deep.equal([issue2.result, issue]);
    expect(
      addIncludedIssues({ ...formData, additionalIssues: [] }),
    ).to.deep.equal([issue2.result]);
  });
  it('should not add additional items to contestedIssues array', () => {
    const issue = {
      type: 'contestableIssue',
      attributes: { issue: 'test', decisionDate: validDate1 },
    };
    const formData = {
      contestedIssues: [
        { ...issue1.raw, [SELECTED]: false },
        { ...issue2.raw, [SELECTED]: true },
      ],
      additionalIssues: [
        { issue: 'not-added', decisionDate: validDate2, [SELECTED]: false },
        { ...issue.attributes },
      ],
    };
    expect(addIncludedIssues(formData)).to.deep.equal([issue2.result]);
    expect(
      addIncludedIssues({ ...formData, additionalIssues: [] }),
    ).to.deep.equal([issue2.result]);
  });
  it('should remove duplicate items', () => {
    const formData = {
      contestedIssues: [
        { ...issue1.raw, [SELECTED]: true },
        { ...issue2.raw, [SELECTED]: true },
        { ...issue1.raw, [SELECTED]: true },
        { ...issue2.raw, [SELECTED]: true },
      ],
      additionalIssues: [],
    };
    expect(addIncludedIssues(formData)).to.deep.equal([
      issue1.result,
      issue2.result,
    ]);
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

describe('getRep', () => {
  const getDataV2 = ({
    rep = 'rep',
    extension = '1234',
    email = 'sully@pixar.com',
  } = {}) => ({
    informalConference: rep,
    informalConferenceRep: {
      firstName: 'James',
      lastName: 'Sullivan',
      phone: '8005551212',
      extension,
      email,
    },
  });

  it('should return null for v2 non-rep choices', () => {
    expect(getRep(getDataV2({ rep: 'me' }))).to.be.null;
  });
  it('should return all v2 rep info', () => {
    expect(getRep(getDataV2({}))).to.deep.equal({
      firstName: 'James',
      lastName: 'Sullivan',
      phone: {
        countryCode: '1',
        areaCode: '800',
        phoneNumber: '5551212',
        phoneNumberExt: '1234',
      },
      email: 'sully@pixar.com',
    });
  });
  it('should not include empty v2 rep info', () => {
    expect(getRep(getDataV2({ extension: '', email: '' }))).to.deep.equal({
      firstName: 'James',
      lastName: 'Sullivan',
      phone: {
        countryCode: '1',
        areaCode: '800',
        phoneNumber: '5551212',
      },
    });
  });
});

describe('getConferenceTime', () => {
  it('should return empty string', () => {
    expect(getConferenceTime()).to.equal('');
  });
  it('should return v2 times', () => {
    expect(
      getConferenceTime({ informalConferenceTime: 'time0800to1200' }),
    ).to.deep.equal('800-1200 ET');
    expect(
      getConferenceTime({ informalConferenceTime: 'time1200to1630' }),
    ).to.deep.equal('1200-1630 ET');
  });
});

describe('getAddress', () => {
  it('should return a cleaned up address object', () => {
    // zipCode5 returns 5 zeros if country isn't set to 'US'
    const result = { zipCode5: '00000' };
    const wrap = obj => ({ veteran: { address: obj } });
    expect(getAddress()).to.deep.equal(result);
    expect(getAddress({})).to.deep.equal(result);
    expect(getAddress(wrap({}))).to.deep.equal(result);
    expect(getAddress(wrap({ temp: 'test' }))).to.deep.equal(result);
    expect(getAddress(wrap({ addressLine1: 'test' }))).to.deep.equal({
      addressLine1: 'test',
      zipCode5: '00000',
    });
    expect(
      getAddress(wrap({ countryCodeIso2: 'US', zipCode: '10101' })),
    ).to.deep.equal({
      countryCodeISO2: 'US',
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
      zipCode5: '10101',
      countryCodeISO2: 'US',
      internationalPostalCode: '12345',
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
          countryCodeIso2: 'GB',
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
      countryCodeISO2: 'GB',
      internationalPostalCode: '12345',
    });
    expect(
      getAddress(
        wrap({ countryCodeIso2: 'GB', internationalPostalCode: '55555' }),
      ),
    ).to.deep.equal({
      countryCodeISO2: 'GB',
      zipCode5: '00000',
      internationalPostalCode: '55555',
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

describe('getTimeZone', () => {
  it('should return a string', () => {
    // result will be a location string, not stubbing for this test
    expect(getTimeZone().length).to.be.greaterThan(1);
  });
});

describe('getContact', () => {
  it('should return an empty string', () => {
    expect(getContact({})).to.eq('');
  });
  it('should return a string containing representative', () => {
    expect(getContact({ informalConference: 'rep' })).to.eq('representative');
  });
  it('should return a string containing veteran', () => {
    expect(getContact({ informalConference: 'me' })).to.eq('veteran');
  });
});
