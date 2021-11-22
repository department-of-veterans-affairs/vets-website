import moment from 'moment';
import { expect } from 'chai';

import { SELECTED } from '../../constants';
import { getDate } from '../../utils/dates';

import {
  getEligibleContestableIssues,
  apiVersion1,
  apiVersion2,
  isVersion1Data,
  someSelected,
  hasSomeSelected,
  getSelected,
  getSelectedCount,
  getIssueName,
  getIssueDate,
  getIssueNameAndDate,
  hasDuplicates,
  showAddIssuesPage,
  showAddIssueQuestion,
  isEmptyObject,
  setInitialEditMode,
  processContestableIssues,
  readableList,
} from '../../utils/helpers';

describe('getEligibleContestableIssues', () => {
  const date = moment().startOf('day');

  const eligibleIssue = {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'Issue 2',
      description: '',
      approxDecisionDate: getDate({ date, offset: { months: -10 } }),
    },
  };
  const ineligibleIssue = [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Issue 1',
        description: '',
        approxDecisionDate: getDate({ date, offset: { years: -2 } }),
      },
    },
  ];
  const deferredIssue = {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'Issue 2',
      description: 'this is a deferred issue',
      approxDecisionDate: getDate({ date, offset: { months: -1 } }),
    },
  };

  it('should return empty array', () => {
    expect(getEligibleContestableIssues()).to.have.lengthOf(0);
    expect(getEligibleContestableIssues([])).to.have.lengthOf(0);
    expect(getEligibleContestableIssues([{}])).to.have.lengthOf(0);
  });
  it('should filter out dates more than one year in the past', () => {
    expect(
      getEligibleContestableIssues([ineligibleIssue, eligibleIssue]),
    ).to.deep.equal([eligibleIssue]);
  });
  it('should filter out dates more than one year in the past', () => {
    expect(
      getEligibleContestableIssues([eligibleIssue, ineligibleIssue]),
    ).to.deep.equal([eligibleIssue]);
  });
  it('should filter out deferred issues', () => {
    expect(
      getEligibleContestableIssues([
        eligibleIssue,
        deferredIssue,
        ineligibleIssue,
      ]),
    ).to.deep.equal([eligibleIssue]);
  });
});

describe('apiVersion1', () => {
  it('should return true when feature flag is not set', () => {
    expect(apiVersion1()).to.be.true;
    expect(apiVersion1({ hlrV2: false })).to.be.true;
  });
  it('should return false when feature flag is set', () => {
    expect(apiVersion1({ hlrV2: true })).to.be.false;
  });
});

describe('apiVersion2', () => {
  it('should return undefined/false when feature flag is not set', () => {
    expect(apiVersion2()).to.be.undefined;
    expect(apiVersion2({ hlrV2: false })).to.be.false;
  });
  it('should return true when feature flag is set', () => {
    expect(apiVersion2({ hlrV2: true })).to.be.true;
  });
});

describe('isVersion1Data', () => {
  it('should return true when version 1 data is found', () => {
    expect(isVersion1Data({ zipCode5: '12345' })).to.be.true;
  });
  it('should return false when feature flag is not set', () => {
    expect(isVersion1Data()).to.be.false;
    expect(isVersion1Data({ zipCode5: '' })).to.be.false;
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
      contestedIssues: [
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

describe('showAddIssuesPage', () => {
  it('should return true when no contestable issues selected', () => {
    expect(showAddIssuesPage({})).to.be.true;
    expect(showAddIssuesPage({ contestedIssues: [{}] })).to.be.true;
  });
  it('should return true when question is set to "yes", or no contestable issues selected', () => {
    expect(showAddIssuesPage({ 'view:hasIssuesToAdd': true })).to.be.true;
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': true,
        contestedIssues: [{ [SELECTED]: true }],
      }),
    ).to.be.true;
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': true,
        contestedIssues: [{}],
      }),
    ).to.be.true;
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': false,
        contestedIssues: [{}],
      }),
    ).to.be.true;
  });
  it('should show the issue page when nothing is selected, and past the issues pages', () => {
    // probably unselected stuff on the review & submit page
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': true,
        contestedIssues: [{}],
        additionalIssues: [{}],
      }),
    ).to.be.true;
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': false,
        boardReviewOption: 'foo', // we're past the issues page
        contestedIssues: [{}],
        additionalIssues: [{}],
      }),
    ).to.be.true;
  });
  it('should return false when "no" is chosen and there is a selected contested issue', () => {
    expect(
      showAddIssuesPage({
        'view:hasIssuesToAdd': false,
        contestedIssues: [{ [SELECTED]: true }],
      }),
    ).to.be.false;
  });
});

describe('showAddIssueQuestion', () => {
  it('should show add issue question when contestable issues selected', () => {
    expect(showAddIssueQuestion({ contestedIssues: [{ [SELECTED]: true }] })).to
      .be.true;
  });
  it('should not show add issue question when no issues or none selected', () => {
    expect(showAddIssueQuestion({ contestedIssues: [] })).to.be.false;
    expect(showAddIssueQuestion({ contestedIssues: [{}] })).to.be.false;
    expect(showAddIssueQuestion({ contestedIssues: [{ [SELECTED]: false }] }))
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
    ].forEach(additionalIssues => {
      expect(setInitialEditMode({ additionalIssues })).to.deep.equal([true]);
    });
    expect(
      setInitialEditMode({
        additionalIssues: [
          { issue: '', decisionDate: validDate },
          { issue: 'test', decisionDate: '' },
        ],
      }),
    ).to.deep.equal([true, true]);
  });
  it('should set edit mode when there is an invalid date', () => {
    [
      [{ issue: 'test', decisionDate: getDate({ offset: { months: 1 } }) }],
      [{ issue: 'test', decisionDate: '1899-01-01' }],
      [{ issue: 'test', decisionDate: '2000-01-01' }],
    ].forEach(additionalIssues => {
      expect(setInitialEditMode({ additionalIssues })).to.deep.equal([true]);
    });
    expect(
      setInitialEditMode({
        additionalIssues: [
          { issue: 'test', decisionDate: validDate },
          { issue: 'test', decisionDate: '2000-01-01' },
        ],
      }),
    ).to.deep.equal([false, true]);
  });
  it('should set edit mode when there is a duplicate contestable issue', () => {
    expect(
      setInitialEditMode({
        contestedIssues: [
          {
            attributes: {
              ratingIssueSubjectText: 'test',
              approxDecisionDate: validDate,
            },
          },
        ],
        additionalIssues: [{ issue: 'test', decisionDate: validDate }],
      }),
    ).to.deep.equal([true]);
  });
  it('should set edit mode when there is a duplicate additional issue', () => {
    expect(
      setInitialEditMode({
        additionalIssues: [
          { issue: 'test', decisionDate: validDate },
          { issue: 'test', decisionDate: validDate },
        ],
      }),
    ).to.deep.equal([true, true]);
  });
  it('should not set edit mode when data exists', () => {
    expect(
      setInitialEditMode({
        additionalIssues: [{ issue: 'test', decisionDate: validDate }],
      }),
    ).to.deep.equal([false]);
    expect(
      setInitialEditMode({
        additionalIssues: [
          { issue: 'test', decisionDate: validDate },
          {
            issue: 'test2',
            decisionDate: getDate({ offset: { months: -10 } }),
          },
        ],
      }),
    ).to.deep.equal([false, false]);
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
