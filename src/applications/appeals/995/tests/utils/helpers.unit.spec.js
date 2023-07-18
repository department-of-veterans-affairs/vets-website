import moment from 'moment';
import { expect } from 'chai';

import { SELECTED, LEGACY_TYPE } from '../../constants';

import { getDate } from '../../utils/dates';

import {
  getEligibleContestableIssues,
  getLegacyAppealsLength,
  mayHaveLegacyAppeals,
  someSelected,
  hasSomeSelected,
  getSelected,
  getSelectedCount,
  getIssueName,
  getIssueDate,
  getIssueNameAndDate,
  hasDuplicates,
  isEmptyObject,
  processContestableIssues,
  issuesNeedUpdating,
  appStateSelector,
  getItemSchema,
  readableList,
  calculateIndexOffset,
} from '../../utils/helpers';

describe('getEligibleContestableIssues', () => {
  const date = moment().startOf('day');

  const getIssue = (text, description = '', dateOffset) => ({
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: text,
      description,
      approxDecisionDate: dateOffset
        ? getDate({ date, offset: { months: dateOffset } })
        : '',
    },
  });
  const olderIssue = getIssue('Issue 1', '', -25);
  const eligibleIssue = getIssue('Issue 2', '', -10);
  const deferredIssue = getIssue('Issue 3', 'this is a deferred issue', -1);
  const emptyDateIssue = getIssue('Issue 4');

  it('should return empty array', () => {
    expect(getEligibleContestableIssues()).to.have.lengthOf(0);
    expect(getEligibleContestableIssues([])).to.have.lengthOf(0);
    expect(getEligibleContestableIssues([{}])).to.have.lengthOf(0);
  });
  it('should keep issues with dates more than one year in the past', () => {
    expect(
      getEligibleContestableIssues([olderIssue, eligibleIssue]),
    ).to.deep.equal([olderIssue, eligibleIssue]);
  });
  it('should filter out missing dates', () => {
    expect(
      getEligibleContestableIssues([emptyDateIssue, eligibleIssue]),
    ).to.deep.equal([eligibleIssue]);
  });
  it('should filter out deferred issues', () => {
    expect(
      getEligibleContestableIssues([eligibleIssue, deferredIssue, olderIssue]),
    ).to.deep.equal([eligibleIssue, olderIssue]);
  });
});

describe('getLegacyAppealsLength', () => {
  it('should return 0 with no issues', () => {
    expect(getLegacyAppealsLength()).to.equal(0);
  });
  it('should return 0 with no legacy issues', () => {
    expect(
      getLegacyAppealsLength([{ type: 'one' }, { type: LEGACY_TYPE }]),
    ).to.equal(0);
    expect(
      getLegacyAppealsLength([
        { type: 'one' },
        { type: LEGACY_TYPE, attributes: {} },
      ]),
    ).to.equal(0);
    expect(
      getLegacyAppealsLength([
        { type: 'one' },
        { type: LEGACY_TYPE, attributes: { issues: [] } },
      ]),
    ).to.equal(0);
  });
  it('should return a value > 0 with legacy issues', () => {
    expect(
      getLegacyAppealsLength([
        { type: 'one' },
        { type: LEGACY_TYPE, attributes: { issues: [{}, {}] } },
      ]),
    ).to.equal(2);
    expect(
      getLegacyAppealsLength([
        { type: 'one' },
        { type: LEGACY_TYPE, attributes: { issues: [{}, {}] } },
        { type: LEGACY_TYPE, attributes: { issues: [] } },
        { type: LEGACY_TYPE, attributes: { issues: [{}] } },
      ]),
    ).to.equal(3);
  });
});

describe('mayHaveLegacyAppeals', () => {
  it('should return false if there is no data', () => {
    expect(mayHaveLegacyAppeals()).to.be.false;
  });
  it('should return false if there is no legacy & no additional issues', () => {
    expect(mayHaveLegacyAppeals({ legacyCount: 0 })).to.be.false;
  });
  it('should return false if there is no legacy & a newer contestable issue date', () => {
    const data = {
      legacyCount: 0,
      contestedIssues: [{ attributes: { approxDecisionDate: '2020-01-01' } }],
    };
    expect(mayHaveLegacyAppeals(data)).to.be.false;
  });
  it('should return true if there are some legacy issues & no additional issues', () => {
    expect(mayHaveLegacyAppeals({ legacyCount: 1 })).to.be.true;
  });
  it('should return true if there is no legacy & some additional issues', () => {
    expect(mayHaveLegacyAppeals({ legacyCount: 0, additionalIssues: [{}] })).to
      .be.true;
  });
  it('should return true if there is no legacy & a contestable issue with a legacy date', () => {
    const data = {
      legacyCount: 0,
      contestedIssues: [{ attributes: { approxDecisionDate: '2019-01-01' } }],
    };
    expect(mayHaveLegacyAppeals(data)).to.be.true;
  });
  it('should return true if there is no legacy & a second contestable issue with a legacy date', () => {
    const data = {
      legacyCount: 0,
      contestedIssues: [
        { attributes: { approxDecisionDate: '2021-01-01' } },
        { attributes: { approxDecisionDate: '2019-01-01' } },
      ],
    };
    expect(mayHaveLegacyAppeals(data)).to.be.true;
  });
  it('should return true if there is legacy issue & a contestable issue with a newer date', () => {
    const data = {
      legacyCount: 1,
      contestedIssues: [{ attributes: { approxDecisionDate: '2020-01-01' } }],
    };
    expect(mayHaveLegacyAppeals(data)).to.be.true;
  });
  it('should return true if there is no legacy, has an additional issue & a contestable issue with a newer date', () => {
    const data = {
      legacyCount: 0,
      additionalIssues: [{}],
      contestedIssues: [{ attributes: { approxDecisionDate: '2020-01-01' } }],
    };
    expect(mayHaveLegacyAppeals(data)).to.be.true;
  });
});

describe('someSelected', () => {
  it('should return true for issues that have some selected values', () => {
    expect(someSelected([{ [SELECTED]: true }, {}])).to.be.true;
    expect(someSelected([{}, { [SELECTED]: true }, {}])).to.be.true;
    expect(someSelected([{}, {}, {}, { [SELECTED]: true }])).to.be.true;
  });
  it('should return false for issues with no selected values', () => {
    expect(someSelected()).to.be.false;
    expect(someSelected([])).to.be.false;
    expect(someSelected([{}, {}])).to.be.false;
    expect(someSelected([{}, { [SELECTED]: false }, {}])).to.be.false;
    expect(someSelected([{}, {}, {}, { [SELECTED]: false }])).to.be.false;
  });
});

describe('hasSomeSelected', () => {
  const testIssues = (contestedIssues, additionalIssues) =>
    hasSomeSelected({ contestedIssues, additionalIssues });
  it('should return true for issues that have some selected values', () => {
    expect(testIssues([{ [SELECTED]: true }], [{}])).to.be.true;
    expect(testIssues([{}], [{ [SELECTED]: true }, {}])).to.be.true;
    expect(testIssues([{}], [{}, {}, { [SELECTED]: true }])).to.be.true;
    expect(
      testIssues([{}, { [SELECTED]: true }], [{}, {}, { [SELECTED]: true }]),
    ).to.be.true;
  });
  it('should return false for no selected issues', () => {
    expect(testIssues()).to.be.false;
    expect(testIssues([], [])).to.be.false;
    expect(testIssues([{}], [{}])).to.be.false;
    expect(testIssues([{ [SELECTED]: false }], [{}])).to.be.false;
    expect(testIssues([{}], [{ [SELECTED]: false }, {}])).to.be.false;
    expect(testIssues([{}], [{}, {}, { [SELECTED]: false }])).to.be.false;
    expect(
      testIssues([{}, { [SELECTED]: false }], [{}, {}, { [SELECTED]: false }]),
    ).to.be.false;
  });
});

describe('getSelected & getSelectedCount', () => {
  it('should return selected contested issues', () => {
    const data = {
      contestedIssues: [
        { type: 'no', [SELECTED]: false },
        { type: 'ok', [SELECTED]: true },
      ],
    };
    expect(getSelected(data)).to.deep.equal([
      { type: 'ok', [SELECTED]: true, index: 0 },
    ]);
    expect(getSelectedCount(data, data.additionalIssues)).to.eq(1);
  });
  it('should return selected additional issues', () => {
    const data = {
      additionalIssues: [
        { type: 'no', [SELECTED]: false },
        { type: 'ok', [SELECTED]: true },
      ],
    };
    expect(getSelected(data)).to.deep.equal([
      { type: 'ok', [SELECTED]: true, index: 0 },
    ]);
    expect(getSelectedCount(data, data.additionalIssues)).to.eq(1);
  });
  it('should return all selected issues', () => {
    const data = {
      contestedIssues: [
        { type: 'no1', [SELECTED]: false },
        { type: 'ok1', [SELECTED]: true },
      ],
      additionalIssues: [
        { type: 'no2', [SELECTED]: false },
        { type: 'ok2', [SELECTED]: true },
      ],
    };
    expect(getSelected(data)).to.deep.equal([
      { type: 'ok1', [SELECTED]: true, index: 0 },
      { type: 'ok2', [SELECTED]: true, index: 1 },
    ]);
    expect(getSelectedCount(data, data.additionalIssues)).to.eq(2);
  });
});

describe('getIssueName', () => {
  it('should return undefined', () => {
    expect(getIssueName()).to.be.undefined;
  });
  it('should return a contested issue name', () => {
    expect(
      getIssueName({ attributes: { ratingIssueSubjectText: 'test' } }),
    ).to.eq('test');
  });
  it('should return an added issue name', () => {
    expect(getIssueName({ issue: 'test2' })).to.eq('test2');
  });
});

describe('getIssueDate', () => {
  it('should return undefined', () => {
    expect(getIssueDate()).to.eq('');
  });
  it('should return a contestable issue date', () => {
    expect(
      getIssueDate({ attributes: { approxDecisionDate: '2021-01-01' } }),
    ).to.eq('2021-01-01');
  });
  it('should return an added issue name', () => {
    expect(getIssueDate({ decisionDate: '2021-02-01' })).to.eq('2021-02-01');
  });
});

describe('getIssueNameAndDate', () => {
  it('should return empty string', () => {
    expect(getIssueNameAndDate()).to.equal('');
  });
  it('should return a contested issue name', () => {
    expect(
      getIssueNameAndDate({
        attributes: {
          ratingIssueSubjectText: 'test',
          approxDecisionDate: '2021-01-01',
        },
      }),
    ).to.eq('test2021-01-01');
  });
  it('should return an added issue name', () => {
    expect(
      getIssueNameAndDate({ issue: 'test2', decisionDate: '2021-02-02' }),
    ).to.eq('test22021-02-02');
  });
});

describe('hasDuplicates', () => {
  const contestedIssues = [
    {
      attributes: {
        ratingIssueSubjectText: 'test',
        approxDecisionDate: '2021-01-01',
      },
    },
  ];

  it('should be false with no duplicate additional issues', () => {
    const result = hasDuplicates();
    expect(result).to.be.false;
  });
  it('should be false when there are duplicate contestable issues', () => {
    const result = hasDuplicates({
      contestedIssues: [contestedIssues[0], contestedIssues[0]],
    });
    expect(result).to.be.false;
  });
  it('should be false when there are no duplicate issues (only date differs)', () => {
    const result = hasDuplicates({
      contestedIssues,
      additionalIssues: [{ issue: 'test', decisionDate: '2021-01-02' }],
    });
    expect(result).to.be.false;
  });
  it('should be true when there is a duplicate additional issue', () => {
    const result = hasDuplicates({
      contestedIssues,
      additionalIssues: [{ issue: 'test', decisionDate: '2021-01-01' }],
    });
    expect(result).to.be.true;
  });
  it('should be true when there is are multiple duplicate additional issues', () => {
    const result = hasDuplicates({
      contestedIssues,
      additionalIssues: [
        { issue: 'test2', decisionDate: '2021-02-01' },
        { issue: 'test2', decisionDate: '2021-02-01' },
      ],
    });
    expect(result).to.be.true;
  });
});

describe('isEmptyObject', () => {
  it('should return true for an empty object', () => {
    expect(isEmptyObject({})).to.be.true;
  });
  it('should return true for non objects or filled objects', () => {
    expect(isEmptyObject()).to.be.false;
    expect(isEmptyObject('')).to.be.false;
    expect(isEmptyObject([])).to.be.false;
    expect(isEmptyObject('test')).to.be.false;
    expect(isEmptyObject(null)).to.be.false;
    expect(isEmptyObject(true)).to.be.false;
    expect(isEmptyObject(() => {})).to.be.false;
    expect(isEmptyObject({ test: '' })).to.be.false;
  });
});

describe('processContestableIssues', () => {
  const getIssues = dates =>
    dates.map(date => ({
      attributes: { ratingIssueSubjectText: 'a', approxDecisionDate: date },
    }));
  const getDates = dates =>
    dates.map(date => date.attributes.approxDecisionDate);

  it('should return an empty array with undefined issues', () => {
    expect(getDates(processContestableIssues())).to.deep.equal([]);
  });
  it('should filter out issues missing a title', () => {
    const issues = getIssues(['2020-02-01', '2020-03-01', '2020-01-01']);
    issues[0].attributes.ratingIssueSubjectText = '';
    const result = processContestableIssues(issues);
    expect(getDates(result)).to.deep.equal(['2020-03-01', '2020-01-01']);
  });
  it('should sort issues spanning months with newest date first', () => {
    const dates = ['2020-02-01', '2020-03-01', '2020-01-01'];
    const result = processContestableIssues(getIssues(dates));
    expect(getDates(result)).to.deep.equal([
      '2020-03-01',
      '2020-02-01',
      '2020-01-01',
    ]);
  });
  it('should sort issues spanning a year & months with newest date first', () => {
    const dates = ['2021-01-31', '2020-12-01', '2021-02-02', '2021-02-01'];
    const result = processContestableIssues(getIssues(dates));
    expect(getDates(result)).to.deep.equal([
      '2021-02-02',
      '2021-02-01',
      '2021-01-31',
      '2020-12-01',
    ]);
  });
});

describe('issuesNeedUpdating', () => {
  const getIssues = (allText, dates) =>
    allText.map((text, index) => ({
      attributes: {
        ratingIssueSubjectText: text,
        approxDecisionDate: dates?.[index],
      },
    }));
  it('should return true if the array lengths are different', () => {
    expect(issuesNeedUpdating([], [1])).to.be.true;
    expect(issuesNeedUpdating([1], [1, 2])).to.be.true;
    expect(issuesNeedUpdating([1, 2], [1])).to.be.true;
  });
  it('should return true if the one entry is different', () => {
    const loaded = getIssues(['a', 'b'], ['2020-02-01', '2020-03-01']);
    const existing1 = getIssues(['a', 'c'], ['2020-02-01', '2020-03-01']);
    expect(issuesNeedUpdating(loaded, existing1)).to.be.true;

    const existing2 = getIssues(['a', 'b'], ['2020-02-01', '2020-03-02']);
    expect(issuesNeedUpdating(loaded, existing2)).to.be.true;
  });
  it('should return false if all entries are the same', () => {
    const issues = getIssues(
      ['a', 'b', 'c'],
      ['2020-02-01', '2020-03-01', '2020-01-01'],
    );
    expect(issuesNeedUpdating(issues, issues)).to.be.false;
  });
});

describe('appStateSelector', () => {
  const getIssues = (contestedIssues, additionalIssues) => ({
    state: { form: { data: { contestedIssues, additionalIssues } } },
    result: { contestedIssues, additionalIssues },
  });
  it('should return empty array if data is undefined', () => {
    expect(appStateSelector({})).to.deep.equal(getIssues([], []).result);
  });
  it('should pull issues from state', () => {
    const data1 = getIssues([], [1, 2, 3]);
    expect(appStateSelector(data1.state)).to.deep.equal(data1.result);
    const data2 = getIssues([1, 2, 3], []);
    expect(appStateSelector(data2.state)).to.deep.equal(data2.result);
    const data3 = getIssues([1, 2], [3, 4, 5]);
    expect(appStateSelector(data3.state)).to.deep.equal(data3.result);
  });
});

describe('getItemSchema', () => {
  const schema = {
    items: [{ a: 1 }, { a: 2 }, { a: 3 }],
    additionalItems: { b: 1 },
  };
  it('should return indexed iItems', () => {
    expect(getItemSchema(schema, 0)).to.deep.equal({ a: 1 });
    expect(getItemSchema(schema, 1)).to.deep.equal({ a: 2 });
    expect(getItemSchema(schema, 2)).to.deep.equal({ a: 3 });
  });
  it('should return additionalItems', () => {
    expect(getItemSchema(schema, 3)).to.deep.equal({ b: 1 });
  });
});

describe('readableList', () => {
  it('should return an empty string', () => {
    expect(readableList([])).to.eq('');
    expect(readableList(['', null, 0])).to.eq('');
  });
  it('should return a combined list with commas with "and" for the last item', () => {
    expect(readableList(['one'])).to.eq('one');
    expect(readableList(['', 'one', null])).to.eq('one');
    expect(readableList(['one', 'two'])).to.eq('one and two');
    expect(readableList([1, 2, 'three'])).to.eq('1, 2, and three');
    expect(readableList(['v', null, 'w', 'x', '', 'y', 'z'])).to.eq(
      'v, w, x, y, and z',
    );
  });
});

describe('calculateIndexOffset', () => {
  it('should return an offset value', () => {
    expect(calculateIndexOffset(2, 2)).to.eq(0);
    expect(calculateIndexOffset(4, 2)).to.eq(2);
    expect(calculateIndexOffset(5, 4)).to.eq(1);
  });
});
