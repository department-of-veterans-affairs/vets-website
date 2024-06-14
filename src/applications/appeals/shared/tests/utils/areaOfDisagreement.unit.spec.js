import { expect } from 'chai';

import {
  copyAreaOfDisagreementOptions,
  calculateOtherMaxLength,
  disagreeWith,
} from '../../utils/areaOfDisagreement';

import { MAX_LENGTH, SUBMITTED_DISAGREEMENTS } from '../../constants';

describe('copyAreaOfDisagreementOptions', () => {
  it('should return original issues only', () => {
    const result = [
      { issue: 'test' },
      { attributes: { ratingIssueSubjectText: 'test2' } },
    ];
    expect(copyAreaOfDisagreementOptions(result, [])).to.deep.equal(result);
  });
  it('should return additional issue with included options', () => {
    const newIssues = [
      { issue: 'test' },
      { attributes: { ratingIssueSubjectText: 'test2' } },
    ];
    const existingIssues = [
      { issue: 'test', disagreementOptions: { test: true } },
    ];
    const result = [
      { issue: 'test', disagreementOptions: { test: true }, otherEntry: '' },
      { attributes: { ratingIssueSubjectText: 'test2' } },
    ];
    expect(
      copyAreaOfDisagreementOptions(newIssues, existingIssues),
    ).to.deep.equal(result);
  });
  it('should return eligible issues with included options', () => {
    const newIssues = [
      { issue: 'test' },
      { attributes: { ratingIssueSubjectText: 'test2' } },
    ];
    const existingIssues = [
      {
        attributes: { ratingIssueSubjectText: 'test2' },
        disagreementOptions: { test: true },
        otherEntry: 'ok',
      },
    ];
    expect(
      copyAreaOfDisagreementOptions(newIssues, existingIssues),
    ).to.deep.equal([newIssues[0], existingIssues[0]]);
  });

  it('should return disagreement options & other entry', () => {
    const result = [
      { issue: 'test', disagreementOptions: { test: true }, otherEntry: 'ok' },
    ];
    expect(
      copyAreaOfDisagreementOptions([{ issue: 'test' }], result),
    ).to.deep.equal(result);
  });
});

describe('calculateOtherMaxLength', () => {
  const keys = Object.keys(SUBMITTED_DISAGREEMENTS);
  const values = Object.values(SUBMITTED_DISAGREEMENTS);
  const getData = settings => {
    const disagreementOptions = keys.reduce((finalOptions, key, index) => {
      if (settings[index]) {
        return { ...finalOptions, [key]: true };
      }
      return finalOptions;
    }, {});
    return { disagreementOptions };
  };
  const calcLength = settings => {
    const string = values.filter((value, index) => settings[index]).join(',');
    // add 1 to string length for the final comma
    return MAX_LENGTH.DISAGREEMENT_REASON - (string.length + 1);
  };
  it('should return max length when nothing is selected', () => {
    expect(calculateOtherMaxLength(getData([]))).to.eq(
      MAX_LENGTH.DISAGREEMENT_REASON,
    );
  });
  it('should return appropriate length with 1 selection', () => {
    const data = [true];
    const length = calcLength(data);
    expect(calculateOtherMaxLength(getData(data))).to.eq(length);
  });
  it('should return appropriate length with 2 selections', () => {
    const data = [true, false, true];
    const length = calcLength(data);
    expect(calculateOtherMaxLength(getData(data))).to.eq(length);
  });
  it('should return appropriate length with 2 different selections', () => {
    const data = [false, true, true];
    const length = calcLength(data);
    expect(calculateOtherMaxLength(getData(data))).to.eq(length);
  });
  it('should return appropriate length with 3 selections', () => {
    const data = [true, true, true];
    const length = calcLength(data);
    expect(calculateOtherMaxLength(getData(data))).to.eq(length);
  });
});

describe('disagreeWith', () => {
  const getData = (
    serviceConnection,
    effectiveDate,
    evaluation,
    otherEntry,
  ) => ({
    disagreementOptions: {
      serviceConnection,
      effectiveDate,
      evaluation,
    },
    otherEntry,
  });
  it('should return an empty list', () => {
    expect(disagreeWith()).to.eq('Disagree with ');
    expect(disagreeWith({})).to.eq('Disagree with ');
    expect(disagreeWith(getData())).to.eq('Disagree with ');
  });
  it('should return a list of selected disagreements', () => {
    expect(disagreeWith(getData(true))).to.eq(
      'Disagree with the service connection',
    );
    expect(disagreeWith(getData(false, true))).to.eq(
      'Disagree with the effective date of award',
    );
    expect(disagreeWith(getData(false, false, true))).to.eq(
      'Disagree with your evaluation of my condition',
    );
    expect(disagreeWith(getData(true, true))).to.eq(
      'Disagree with the service connection and the effective date of award',
    );
    expect(disagreeWith(getData(true, true, true))).to.eq(
      'Disagree with the service connection, the effective date of award, and your evaluation of my condition',
    );
    expect(disagreeWith(getData(true, false, true))).to.eq(
      'Disagree with the service connection and your evaluation of my condition',
    );
    expect(disagreeWith(getData(false, true, true))).to.eq(
      'Disagree with the effective date of award and your evaluation of my condition',
    );
  });
  it('should return a list of selected disagreements & other text', () => {
    expect(disagreeWith(getData(false, false, false, 'test 1'))).to.eq(
      'Disagree with test 1',
    );
    expect(disagreeWith(getData(true, false, false, 'test 2'))).to.eq(
      'Disagree with the service connection and test 2',
    );
    expect(disagreeWith(getData(false, true, false, 'test 3'))).to.eq(
      'Disagree with the effective date of award and test 3',
    );
    expect(disagreeWith(getData(false, false, true, 'test 4'))).to.eq(
      'Disagree with your evaluation of my condition and test 4',
    );
    expect(disagreeWith(getData(true, true, false, 'test 5'))).to.eq(
      'Disagree with the service connection, the effective date of award, and test 5',
    );
    expect(disagreeWith(getData(true, true, true, 'test 6'))).to.eq(
      'Disagree with the service connection, the effective date of award, your evaluation of my condition, and test 6',
    );
  });
});
