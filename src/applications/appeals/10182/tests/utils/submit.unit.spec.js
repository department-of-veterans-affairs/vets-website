import { expect } from 'chai';

import { SHOW_PART3 } from '../../constants';
import {
  addIncludedIssues,
  addUploads,
  createIssueName,
  getAddress,
  getContestableIssues,
  getEligibleContestableIssues,
  getPart3Data,
  getTimeZone,
  getEmail,
} from '../../utils/submit';

import { SELECTED } from '../../../shared/constants';
import { getDate } from '../../../shared/utils/dates';

const validDate1 = getDate({ offset: { months: -2 } });
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

const validDate2 = getDate({ offset: { months: -4 } });
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

describe('getEligibleContestableIssues', () => {
  it('should empty array', () => {
    expect(getEligibleContestableIssues()).to.deep.equal([]);
    expect(getEligibleContestableIssues([{}])).to.deep.equal([]);
  });
  it('should remove ineligible dates', () => {
    expect(
      getEligibleContestableIssues([
        {
          type: 'contestableIssue',
          attributes: {
            ...issue1.raw.attributes,
            approxDecisionDate: '2020-01-01',
          },
        },
        {
          type: 'contestableIssue',
          attributes: {
            ...issue2.raw.attributes,
            approxDecisionDate: '2020-01-02',
          },
        },
      ]),
    ).to.deep.equal([]);
  });
  it('should keep eligible dates', () => {
    const issue = {
      type: 'contestableIssue',
      attributes: {
        ...issue1.raw.attributes,
        approxDecisionDate: '2020-01-01',
      },
    };
    expect(getEligibleContestableIssues([issue, issue2.raw])).to.deep.equal([
      issue2.rawCleaned,
    ]);
  });
  it('should keep older decision dates when show part 3 feature is enabled', () => {
    expect(
      // include showPart3 feature flag
      getEligibleContestableIssues([issue1.raw, issue2.raw], {
        showPart3: true,
      }),
    ).to.deep.equal([issue1.rawCleaned, issue2.rawCleaned]);
  });
});

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
    expect(getContestableIssues(formData)).to.deep.equal([
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
    expect(getContestableIssues(formData)).to.deep.equal([issue2.result]);
  });
  it('should return empty array', () => {
    expect(getContestableIssues()).to.deep.equal([]);
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
    const wrap = obj => ({
      // define countryCodeIso2 to '' until we remove SHOW_PART3 flag
      veteran: { address: { countryCodeIso2: '', ...obj } },
    });
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
    ).to.deep.equal({ zipCode5: '10101' });
    expect(
      getAddress({
        ...wrap({ countryCodeIso2: 'US', zipCode: '10101' }),
        [SHOW_PART3]: true,
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
      countryName: 'United States',
      internationalPostalCode: '12345',
    });
    expect(getAddress({ ...testAddress(), [SHOW_PART3]: true })).to.deep.equal({
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode5: '10101',
      countryCodeISO2: 'US', // ISO is all caps here
      internationalPostalCode: '12345',
    });
    expect(
      getAddress({ ...testAddress('GB'), [SHOW_PART3]: true }),
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
      getAddress({
        ...wrap({
          countryCodeIso2: 'GB',
          zipCode: '10101',
          internationalPostalCode: '55555',
        }),
        [SHOW_PART3]: true,
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
      // countryCodeISO2: 'GB',
      countryName: 'Great Britain',
      zipCode5: '00000',
      internationalPostalCode: '55555',
    });
  });
});

describe('getTimeZone', () => {
  it('should return a string', () => {
    // result will be a location string, not stubbing for this test
    expect(getTimeZone().length).to.be.greaterThan(1);
  });
});

describe('getPart3Data', () => {
  const getResult = ({ ext = false, denial = false } = {}) => ({
    requestingExtension: ext,
    appealingVhaDenial: denial, // Vha not VHA is submitted
  });
  it('should return an empty object', () => {
    expect(getPart3Data({})).to.deep.equal({});
  });
  it('should return part 3 default data', () => {
    expect(getPart3Data({ [SHOW_PART3]: true })).to.deep.equal(getResult());
  });
  it('should return appealing VHA denial as true', () => {
    const data = { [SHOW_PART3]: true, appealingVHADenial: true };
    const result = getResult({ denial: true });
    expect(getPart3Data(data)).to.deep.equal(result);
  });
  it('should return extension reason', () => {
    const formData = {
      [SHOW_PART3]: true,
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
    expect(getEmail()).to.deep.equal({ emailAddressText: '' });
  });
  it('should return v0 email', () => {
    const data = { [SHOW_PART3]: false, veteran: { email: 'test@test.com' } };
    expect(getEmail(data)).to.deep.equal({ emailAddressText: 'test@test.com' });
  });
  it('should return v1 email', () => {
    const data = { [SHOW_PART3]: true, veteran: { email: 'test@test.com' } };
    expect(getEmail(data)).to.deep.equal({ email: 'test@test.com' });
  });
});
