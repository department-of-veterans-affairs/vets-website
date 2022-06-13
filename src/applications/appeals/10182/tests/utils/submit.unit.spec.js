import { expect } from 'chai';
import { SELECTED } from '../../constants';
import { getDate } from '../../utils/dates';

import {
  getEligibleContestableIssues,
  createIssueName,
  getContestableIssues,
  addIncludedIssues,
  addAreaOfDisagreement,
  addUploads,
  removeEmptyEntries,
  getAddress,
  getPhone,
  getTimeZone,
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

describe('getEligibleContestableIssues', () => {
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
      issue2.raw,
    ]);
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
      contestableIssues: [
        { ...issue1.raw, [SELECTED]: false },
        { ...issue2.raw, [SELECTED]: true },
      ],
    };
    expect(getContestableIssues(formData)).to.deep.equal([issue2.result]);
  });
});

describe('addIncludedIssues', () => {
  it('should add additional items to contestableIssues array', () => {
    const issue = {
      type: 'contestableIssue',
      attributes: { issue: 'test', decisionDate: validDate1 },
    };
    const formData = {
      contestableIssues: [
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
      contestableIssues: [
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
});

describe('addAreaOfDisagreement', () => {
  it('should process a single choice', () => {
    const formData = {
      areaOfDisagreement: [
        {
          disagreementOptions: {
            serviceConnection: true,
            effectiveDate: false,
          },
        },
        {
          disagreementOptions: {
            effectiveDate: true,
          },
          otherEntry: '',
        },
      ],
    };
    const result = addAreaOfDisagreement(
      [issue1.result, issue2.result],
      formData,
    );
    expect(result[0].attributes.disagreementArea).to.equal(
      'service connection',
    );
    expect(result[1].attributes.disagreementArea).to.equal('effective date');
  });
  it('should process multiple choices', () => {
    const formData = {
      areaOfDisagreement: [
        {
          disagreementOptions: {
            serviceConnection: true,
            effectiveDate: true,
            evaluation: true,
          },
          otherEntry: '',
        },
      ],
    };
    const result = addAreaOfDisagreement([issue1.result], formData);
    expect(result[0].attributes.disagreementArea).to.equal(
      'service connection,effective date,disability evaluation',
    );
  });
  it('should process other choice', () => {
    const formData = {
      areaOfDisagreement: [
        {
          disagreementOptions: {
            serviceConnection: true,
            effectiveDate: true,
            evaluation: true,
          },
          otherEntry: 'this is an other entry',
        },
      ],
    };
    const result = addAreaOfDisagreement([issue1.result], formData);
    expect(result[0].attributes.disagreementArea).to.equal(
      'service connection,effective date,disability evaluation,this is an other entry',
    );
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
      zipCode5: '00000',
      countryName: 'USA',
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
