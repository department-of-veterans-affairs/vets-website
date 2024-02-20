import { expect } from 'chai';
import { getDate } from '../../utils/dates';

import { SELECTED } from '../../constants';

import {
  removeEmptyEntries,
  createIssueName,
  getContestedIssues,
  addIncludedIssues,
  getPhone,
  addAreaOfDisagreement,
} from '../../utils/submit';

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

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
  it('should combine issue details and truncate extra long descriptions', () => {
    // contestable issues only
    expect(getName('test', text, '20')).to.eq(
      'test - 20% - Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Uten',
    );
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
  it('should not throw a JS error with no disagreement options', () => {
    const formData = {
      areaOfDisagreement: [],
    };
    const result = addAreaOfDisagreement([issue1.result], formData);
    expect(result[0].attributes.disagreementArea).to.equal('');
  });
});
