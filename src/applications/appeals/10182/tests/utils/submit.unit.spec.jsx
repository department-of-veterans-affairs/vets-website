import { expect } from 'chai';

import {
  addIncludedIssues,
  addUploads,
  createIssueName,
  getAddress,
  getContestableIssues,
  getPart3Data,
  getEmail,
} from '../../utils/submit';

import { SELECTED } from '../../../shared/constants';
import { parseDateWithOffset } from '../../../shared/utils/dates';

const validDate1 = parseDateWithOffset({ months: -2 });
const issue1 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: '  tinnitus ',
      description: 'both   ears ',
      approxDecisionDate: validDate1,
      decisionIssueId: 1,
      ratingIssueReferenceId: '2',
      ratingDecisionReferenceId: '3',
      ratingIssuePercentNumber: '10',
    },
  },
  rawCleaned: {
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

const validDate2 = parseDateWithOffset({ months: -4 });
const issue2 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'left   knee ',
      approxDecisionDate: validDate2,
      decisionIssueId: 4,
      ratingIssueReferenceId: '5',
    },
  },
  rawCleaned: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'left knee',
      description: '',
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

  it('should return no issue details', () => {
    expect(createIssueName()).to.eq('0%');
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
      contestedIssues: [
        { ...issue1.raw, [SELECTED]: true },
        { ...issue2.raw, [SELECTED]: true },
      ],
    };
    expect(getContestableIssues({ ...formData, appAbbr: 'NOD' })).to.deep.equal(
      [issue1.result, issue2.result],
    );
  });
  it('should return second issue', () => {
    const formData = {
      contestedIssues: [
        { ...issue1.raw, [SELECTED]: false },
        { ...issue2.raw, [SELECTED]: true },
      ],
    };
    expect(getContestableIssues({ ...formData, appAbbr: 'NOD' })).to.deep.equal(
      [issue2.result],
    );
  });
  it('should return empty array', () => {
    expect(getContestableIssues({ appAbbr: 'NOD' })).to.deep.equal([]);
  });
});

describe('addIncludedIssues', () => {
  it('should add additional items to contestableIssues array', () => {
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
  it('should not add additional items to contestableIssues array', () => {
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

describe('addUploads', () => {
  const getData = (checked, files) => ({
    boardReviewOption: 'evidence_submission',
    'view:additionalEvidence': checked,
    evidence: files.map(name => ({ name, confirmationCode: '123' })),
  });
  it('should add uploads', () => {
    expect(addUploads(getData(true, ['test1', 'test2']))).to.deep.equal([
      { name: 'test1', confirmationCode: '123' },
      { name: 'test2', confirmationCode: '123' },
    ]);
  });
  it('should not add uploads if not submitting more evidence', () => {
    const data = {
      ...getData(true, ['test1', 'test2']),
      boardReviewOption: 'hearing',
    };
    expect(addUploads(data)).to.deep.equal([]);
  });
  it('should not add uploads if submit later is selected', () => {
    expect(addUploads(getData(false, ['test1', 'test2']))).to.deep.equal([]);
  });
});

describe('getAddress', () => {
  it('should return a cleaned up address object', () => {
    // zipCode5 returns 5 zeros if country isn't set to 'US'
    const result = { zipCode5: '00000' };
    const wrap = obj => ({ veteran: { address: obj } });
    expect(getAddress()).to.deep.equal(result);
    expect(getAddress(wrap({}))).to.deep.equal(result);
    expect(getAddress(wrap({ temp: 'test' }))).to.deep.equal(result);
    expect(getAddress(wrap({ addressLine1: 'test' }))).to.deep.equal({
      addressLine1: 'test',
      zipCode5: '00000',
    });
    expect(getAddress(wrap({ zipCode: '10101' }))).to.deep.equal({
      zipCode5: '00000',
    });
    expect(
      getAddress(wrap({ countryCodeIso2: 'US', zipCode: '10101' })),
    ).to.deep.equal({ countryCodeISO2: 'US', zipCode5: '10101' });
    expect(
      getAddress({
        ...wrap({ countryCodeIso2: 'US', zipCode: '10101' }),
      }),
    ).to.deep.equal({
      countryCodeISO2: 'US',
      zipCode5: '10101',
    });
    const testAddress = (country = 'US') =>
      wrap({
        addressLine1: '123 test',
        addressLine2: 'c/o foo',
        addressLine3: 'suite 99',
        city: 'Big City',
        stateCode: 'NV',
        zipCode: '10101',
        countryName: 'United States',
        countryCodeIso2: country, // Iso is camel-case here
        internationalPostalCode: '12345',
        extra: 'will not be included',
      });
    expect(getAddress(testAddress())).to.deep.equal({
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode5: '10101',
      countryCodeISO2: 'US', // ISO is all caps here
      internationalPostalCode: '12345',
    });
    expect(getAddress(testAddress('GB'))).to.deep.equal({
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
      getAddress({
        ...wrap({
          countryCodeIso2: 'GB',
          zipCode: '10101',
          internationalPostalCode: '55555',
        }),
      }),
    ).to.deep.equal({
      countryCodeISO2: 'GB',
      zipCode5: '00000',
      internationalPostalCode: '55555',
    });
    expect(
      getAddress(
        wrap({
          countryName: 'Great Britain',
          countryCodeIso2: 'GB',
          zipCode: '10101',
          internationalPostalCode: '55555',
        }),
      ),
    ).to.deep.equal({
      countryCodeISO2: 'GB',
      zipCode5: '00000',
      internationalPostalCode: '55555',
    });
  });
});

describe('getPart3Data', () => {
  const getResult = ({ ext = false, denial = false } = {}) => ({
    requestingExtension: ext,
    appealingVhaDenial: denial, // Vha not VHA is submitted
  });
  it('should return part 3 default data', () => {
    expect(getPart3Data({})).to.deep.equal(getResult());
  });
  it('should return appealing VHA denial as true', () => {
    const data = { appealingVHADenial: true };
    const result = getResult({ denial: true });
    expect(getPart3Data(data)).to.deep.equal(result);
  });
  it('should return extension reason', () => {
    const formData = {
      requestingExtension: true,
      extensionReason: 'yep',
    };
    const result = {
      ...getResult({ ext: true }),
      extensionReason: 'yep',
    };
    expect(getPart3Data(formData)).to.deep.equal(result);
  });
});

describe('getEmail', () => {
  it('should return empty string', () => {
    expect(getEmail()).to.deep.equal({ email: '' });
  });
  it('should return v1 email', () => {
    const data = { veteran: { email: 'test@test.com' } };
    expect(getEmail(data)).to.deep.equal({ email: 'test@test.com' });
  });
});
