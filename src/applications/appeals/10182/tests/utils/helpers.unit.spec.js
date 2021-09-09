import { expect } from 'chai';

import { SELECTED } from '../../constants';
import {
  someSelected,
  hasSomeSelected,
  getSelected,
  getSelectedCount,
  getIssueName,
  getIssueNameAndDate,
  showAddIssuesPage,
  showAddIssueQuestion,
  isEmptyObject,
  setInitialEditMode,
  issuesNeedUpdating,
  processContestableIssues,
  readableList,
} from '../../utils/helpers';
import { getDate } from '../../utils/dates';

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
  const testIssues = (contestableIssues, additionalIssues) =>
    hasSomeSelected({ contestableIssues, additionalIssues });
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
  it('should return selected contestable issues', () => {
    const data = {
      contestableIssues: [
        { type: 'no', [SELECTED]: false },
        { type: 'ok', [SELECTED]: true },
      ],
    };
    expect(getSelected(data)).to.deep.equal([
      { type: 'ok', [SELECTED]: true, index: 0 },
    ]);
    expect(getSelectedCount(data, data.additionalIssues)).to.eq(1);
  });
  it('should not return selected additional issues when Veteran chooses not to include them', () => {
    const data = {
      'view:hasIssuesToAdd': false,
      additionalIssues: [
        { type: 'no', [SELECTED]: false },
        { type: 'ok', [SELECTED]: true },
      ],
    };
    expect(getSelected(data)).to.deep.equal([]);
    expect(getSelectedCount(data, data.additionalIssues)).to.eq(0);
  });
  it('should return selected additional issues', () => {
    const data = {
      'view:hasIssuesToAdd': true,
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
      contestableIssues: [
        { type: 'no1', [SELECTED]: false },
        { type: 'ok1', [SELECTED]: true },
      ],
      'view:hasIssuesToAdd': true,
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
  it('should return a contestable issue name', () => {
    expect(
      getIssueName({ attributes: { ratingIssueSubjectText: 'test' } }),
    ).to.eq('test');
  });
  it('should return an added issue name', () => {
    expect(getIssueName({ issue: 'test2' })).to.eq('test2');
  });
});

describe('getIssueNameAndDate', () => {
  it('should return empty string', () => {
    expect(getIssueNameAndDate()).to.equal('');
  });
  it('should return a contestable issue name', () => {
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

describe('showAddIssuesPage', () => {
  it('should show add issue page when no contestable issues selected', () => {
    expect(showAddIssuesPage({})).to.be.true;
    expect(showAddIssuesPage({ contestableIssues: [{}] })).to.be.true;
  });
  it('should show add issue page when question is set to "yes"', () => {
    expect(showAddIssuesPage({ 'view:hasIssuesToAdd': true })).to.be.true;
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': true,
        contestableIssues: [{ [SELECTED]: true }],
      }),
    ).to.be.true;
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': true,
        contestableIssues: [{}],
      }),
    ).to.be.true;
  });
  it('should not show issue page when "no" is chosen', () => {
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': false,
        contestableIssues: [{ [SELECTED]: true }],
      }),
    ).to.be.false;
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': false,
        contestableIssues: [{}],
      }),
    ).to.be.false;
  });
  it('should show the issue page when nothing is selected, and past the issues pages', () => {
    // probably unselected stuff on the review & submit page
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': true,
        contestableIssues: [{}],
        additionalIssues: [{}],
      }),
    ).to.be.true;
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': false,
        boardReviewOption: 'foo', // we're past the issues page
        contestableIssues: [{}],
        additionalIssues: [{}],
      }),
    ).to.be.true;
  });
});

describe('showAddIssueQuestion', () => {
  it('should show add issue question when contestable issues selected', () => {
    expect(showAddIssueQuestion({ contestableIssues: [{ [SELECTED]: true }] }))
      .to.be.true;
  });
  it('should not show add issue question when no issues or none selected', () => {
    expect(showAddIssueQuestion({ contestableIssues: [] })).to.be.false;
    expect(showAddIssueQuestion({ contestableIssues: [{}] })).to.be.false;
    expect(showAddIssueQuestion({ contestableIssues: [{ [SELECTED]: false }] }))
      .to.be.false;
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

describe('setInitialEditMode', () => {
  const validDate = getDate({ offset: { months: -2 } });
  it('should set edit mode when missing data', () => {
    [
      [{}],
      [{ issue: 'test' }],
      [{ decisionDate: validDate }],
      [{ issue: '', decisionDate: '' }],
      [{ issue: undefined, decisionDate: undefined }],
    ].forEach(test => {
      expect(setInitialEditMode(test)).to.deep.equal([true]);
    });
    expect(
      setInitialEditMode([
        { issue: '', decisionDate: validDate },
        { issue: 'test', decisionDate: '' },
      ]),
    ).to.deep.equal([true, true]);
  });
  it('should set edit mode when there is an invalid date', () => {
    [
      [{ issue: 'test', decisionDate: getDate({ offset: { months: 1 } }) }],
      [{ issue: 'test', decisionDate: '1899-01-01' }],
      [{ issue: 'test', decisionDate: '2000-01-01' }],
    ].forEach(test => {
      expect(setInitialEditMode(test)).to.deep.equal([true]);
    });
    expect(
      setInitialEditMode([
        { issue: 'test', decisionDate: validDate },
        { issue: 'test', decisionDate: '2000-01-01' },
      ]),
    ).to.deep.equal([false, true]);
  });
  it('should not set edit mode when data exists', () => {
    expect(
      setInitialEditMode([{ issue: 'test', decisionDate: validDate }]),
    ).to.deep.equal([false]);
    expect(
      setInitialEditMode([
        { issue: 'test', decisionDate: validDate },
        { issue: 'test2', decisionDate: getDate({ offset: { months: -10 } }) },
      ]),
    ).to.deep.equal([false, false]);
  });
});

describe('issuesNeedUpdating', () => {
  const createEntry = (ratingIssueSubjectText, approxDecisionDate) => ({
    attributes: {
      ratingIssueSubjectText,
      approxDecisionDate,
    },
  });
  it('should return true if array lengths are different', () => {
    expect(issuesNeedUpdating([], [''])).to.be.true;
    expect(issuesNeedUpdating([''], ['', ''])).to.be.true;
  });
  it('should return true if content is different', () => {
    expect(
      issuesNeedUpdating(
        [createEntry('test', '123'), createEntry('test2', '345')],
        [createEntry('test', '123'), createEntry('test2', '346')],
      ),
    ).to.be.true;
    expect(
      issuesNeedUpdating(
        [createEntry('test', '123'), createEntry('test3', '345')],
        [createEntry('test', '123'), createEntry('test', '345')],
      ),
    ).to.be.true;
  });
  it('should return true if arrays are the same', () => {
    expect(
      issuesNeedUpdating(
        [createEntry('test', '123'), createEntry('test2', '345')],
        [createEntry('test', '123'), createEntry('test2', '345')],
      ),
    ).to.be.false;
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

describe('readableList', () => {
  it('should return an empty string', () => {
    expect(readableList([])).to.eq('');
    expect(readableList(['', null, 0])).to.eq('');
  });
  it('should return a combined list with commas with "and" for the last item', () => {
    expect(readableList(['one'])).to.eq('one');
    expect(readableList(['', 'one', null])).to.eq('one');
    expect(readableList(['one', 'two'])).to.eq('one and two');
    expect(readableList([1, 2, 'three'])).to.eq('1, 2 and three');
    expect(readableList(['v', null, 'w', 'x', '', 'y', 'z'])).to.eq(
      'v, w, x, y and z',
    );
  });
});
